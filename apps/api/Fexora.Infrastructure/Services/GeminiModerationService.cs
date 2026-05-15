using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Fexora.Core.DTOs.Moderation;
using Fexora.Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Fexora.Infrastructure.Services;

public class GeminiModerationService(
    IConfiguration config,
    HttpClient httpClient,
    ILogger<GeminiModerationService> logger
) : IImageModerationService
{
    private const string Model = "gemini-2.5-flash";

    private static readonly string SystemInstruction = """
        You are an image moderation system for an adult (18+) premium content platform called Fexora.
        Analyze the image at the provided URL and return a JSON object with:
        - "score": number 0.0-1.0 (0=safe, 1=severe violation)
        - "fsk_rating": "12+" or "16+" or "18+"
        - "categories": array of {"name": string, "score": number} for: underage_indicators, non_consensual, violence, illegal_content, face_detected, duplicate_suspected
        - "flags": array of strings describing specific concerns (empty if none)

        Context: Adult content is ALLOWED. Only flag: potential underage subjects, non-consensual imagery, extreme violence, illegal content.
        Respond ONLY with valid JSON, no markdown.
        """;

    public async Task<ModerationResult> AnalyzeImageAsync(ImageModerationRequest request, CancellationToken ct = default)
    {
        var apiKey = config["AiModeration:Gemini:ApiKey"];
        if (string.IsNullOrEmpty(apiKey))
        {
            logger.LogWarning("Gemini API key not configured, skipping image moderation");
            return FallbackResult("gemini");
        }

        try
        {
            var apiUrl = $"https://generativelanguage.googleapis.com/v1beta/models/{Model}:generateContent?key={apiKey}";

            var payload = new
            {
                system_instruction = new { parts = new[] { new { text = SystemInstruction } } },
                contents = new[]
                {
                    new
                    {
                        parts = new object[]
                        {
                            new { text = $"Analyze this image for content moderation. Title: {request.Title ?? "untitled"}" },
                            new
                            {
                                file_data = new
                                {
                                    mime_type = "image/jpeg",
                                    file_uri = request.ImageUrl
                                }
                            }
                        }
                    }
                },
                generationConfig = new
                {
                    response_mime_type = "application/json",
                    temperature = 0.1
                }
            };

            var json = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await httpClient.PostAsync(apiUrl, content, ct);
            response.EnsureSuccessStatusCode();

            var responseJson = await response.Content.ReadAsStringAsync(ct);
            var geminiResponse = JsonSerializer.Deserialize<GeminiResponse>(responseJson);

            var textPart = geminiResponse?.Candidates?.FirstOrDefault()?.Content?.Parts?.FirstOrDefault();
            if (textPart?.Text == null)
                return FallbackResult("gemini");

            var result = JsonSerializer.Deserialize<AiModerationResponse>(textPart.Text, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (result == null)
                return FallbackResult("gemini");

            return new ModerationResult
            {
                Score = Math.Clamp(result.Score, 0, 1),
                FskRating = result.FskRating ?? "18+",
                Categories = result.Categories?.Select(c => new ModerationCategory
                {
                    Name = c.Name ?? "",
                    Score = Math.Clamp(c.Score, 0, 1)
                }).ToList() ?? [],
                Flags = result.Flags ?? [],
                Provider = "gemini",
                AnalyzedAt = DateTime.UtcNow
            };
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Gemini moderation failed for image: {ImageUrl}", request.ImageUrl);
            return FallbackResult("gemini");
        }
    }

    private static ModerationResult FallbackResult(string provider) => new()
    {
        Score = 0,
        FskRating = "18+",
        Categories = [],
        Flags = ["ai_unavailable"],
        Provider = provider,
        AnalyzedAt = DateTime.UtcNow
    };

    // Gemini API response models
    private class GeminiResponse
    {
        [JsonPropertyName("candidates")]
        public List<Candidate>? Candidates { get; set; }
    }

    private class Candidate
    {
        [JsonPropertyName("content")]
        public GeminiContent? Content { get; set; }
    }

    private class GeminiContent
    {
        [JsonPropertyName("parts")]
        public List<Part>? Parts { get; set; }
    }

    private class Part
    {
        [JsonPropertyName("text")]
        public string? Text { get; set; }
    }

    private class AiModerationResponse
    {
        [JsonPropertyName("score")]
        public double Score { get; set; }

        [JsonPropertyName("fsk_rating")]
        public string? FskRating { get; set; }

        [JsonPropertyName("categories")]
        public List<AiCategory>? Categories { get; set; }

        [JsonPropertyName("flags")]
        public List<string>? Flags { get; set; }
    }

    private class AiCategory
    {
        [JsonPropertyName("name")]
        public string? Name { get; set; }

        [JsonPropertyName("score")]
        public double Score { get; set; }
    }
}
