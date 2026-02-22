using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Fexora.Core.Interfaces;
using Microsoft.Extensions.Configuration;

namespace Fexora.Infrastructure.Services;

public class ResendEmailService(IConfiguration config, HttpClient httpClient) : IEmailService
{
    public async Task SendAsync(string to, string subject, string htmlBody)
    {
        var apiKey = config["Resend:ApiKey"];
        var fromEmail = config["Resend:From"] ?? "noreply@fexora.de";

        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

        var payload = new
        {
            from = fromEmail,
            to = new[] { to },
            subject,
            html = htmlBody
        };

        var json = JsonSerializer.Serialize(payload);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await httpClient.PostAsync("https://api.resend.com/emails", content);
        response.EnsureSuccessStatusCode();
    }
}
