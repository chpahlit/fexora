using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Fexora.Core.DTOs.Moderation;
using Fexora.Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Fexora.Infrastructure.Services;

public class ClaudeModerationService(
    IConfiguration config,
    HttpClient httpClient,
    ILogger<ClaudeModerationService> logger
) : ITextModerationService
{
    private const string ApiUrl = "https://api.anthropic.com/v1/messages";
    private const string Model = "claude-sonnet-4-20250514";

    private static readonly string SystemPrompt = """
        You are a content moderation system for an adult (18+) social platform called Fexora.
        Analyze the provided text and return a JSON object with:
        - "score": number 0.0-1.0 (0=safe, 1=severe violation)
        - "fsk_rating": "12+" or "16+" or "18+"
        - "categories": array of {"name": string, "score": number} for: harassment, pressure, threats, spam, underage_indicators, synthetic_content, scam, copyright
        - "flags": array of strings describing specific concerns (empty if none)

        Context: This is a premium content platform for adults. Consensual adult content is ALLOWED and expected.
        Flag only: harassment, coercion, underage indicators, non-consensual content, threats, spam, scams, copyright violations.
        Do NOT flag consensual adult content, nudity, or erotic fiction between adults.
        Respond ONLY with valid JSON, no markdown.
        """;

    public async Task<ModerationResult> AnalyzeTextAsync(TextModerationRequest request, CancellationToken ct = default)
    {
        var apiKey = config["AiModeration:Claude:ApiKey"];
        if (string.IsNullOrEmpty(apiKey))
        {
            logger.LogWarning("Claude API key not configured, skipping text moderation");
            return FallbackResult("claude");
        }

        try
        {
            httpClient.DefaultRequestHeaders.Clear();
            httpClient.DefaultRequestHeaders.Add("x-api-key", apiKey);
            httpClient.DefaultRequestHeaders.Add("anthropic-version", "2023-06-01");

            var userMessage = string.IsNullOrEmpty(request.Context)
                ? request.Text
                : $"Context: {request.Context}\n\nText to analyze:\n{request.Text}";

            var payload = new
            {
                model = Model,
                max_tokens = 1024,
                system = SystemPrompt,
                messages = new[]
                {
                    new { role = "user", content = userMessage }
                }
            };

            var json = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await httpClient.PostAsync(ApiUrl, content, ct);
            response.EnsureSuccessStatusCode();

            var responseJson = await response.Content.ReadAsStringAsync(ct);
            var claudeResponse = JsonSerializer.Deserialize<ClaudeResponse>(responseJson);

            var textBlock = claudeResponse?.Content?.FirstOrDefault(c => c.Type == "text");
            if (textBlock?.Text == null)
                return FallbackResult("claude");

            var result = JsonSerializer.Deserialize<AiModerationResponse>(textBlock.Text, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (result == null)
                return FallbackResult("claude");

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
                Provider = "claude",
                AnalyzedAt = DateTime.UtcNow
            };
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Claude moderation failed for text: {TextPreview}", request.Text[..Math.Min(50, request.Text.Length)]);
            return FallbackResult("claude");
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

    // Claude API response models
    private class ClaudeResponse
    {
        [JsonPropertyName("content")]
        public List<ContentBlock>? Content { get; set; }
    }

    private class ContentBlock
    {
        [JsonPropertyName("type")]
        public string? Type { get; set; }

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
