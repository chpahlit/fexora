using Fexora.Core.DTOs.Admin;
using Fexora.Core.Entities;
using Fexora.Core.Interfaces;
using Fexora.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Fexora.Infrastructure.Services;

public class PolicyService(FexoraDbContext db, IAuditService audit) : IPolicyService
{
    private static readonly Dictionary<string, (string Value, string Description)> Defaults = new()
    {
        ["min_price_credits"] = ("1", "Minimum content price in credits"),
        ["max_price_credits"] = ("5000", "Maximum content price in credits"),
        ["max_upload_size_mb"] = ("500", "Maximum upload file size in MB"),
        ["allowed_content_types"] = ("Image,Video,Audio,Text", "Comma-separated allowed content types"),
        ["word_filter"] = ("", "Comma-separated blocked words"),
        ["require_age_verification"] = ("true", "Require 18+ verification on registration"),
        ["auto_approve_creators"] = ("false", "Auto-approve content from verified creators"),
        ["payout_min_amount"] = ("50", "Minimum payout amount in EUR"),
    };

    public async Task<List<PolicyConfigResponse>> GetAll()
    {
        return await db.PolicyConfigs
            .OrderBy(p => p.Key)
            .Select(p => new PolicyConfigResponse
            {
                Key = p.Key,
                Value = p.Value,
                Description = p.Description,
                UpdatedAt = p.UpdatedAt,
            })
            .ToListAsync();
    }

    public async Task<string?> GetValue(string key)
    {
        var config = await db.PolicyConfigs.FindAsync(key);
        return config?.Value;
    }

    public async Task<bool> SetValue(string key, string value, Guid actorId)
    {
        var config = await db.PolicyConfigs.FindAsync(key);
        if (config == null)
        {
            config = new PolicyConfig { Key = key, Value = value, UpdatedAt = DateTime.UtcNow, UpdatedById = actorId };
            db.PolicyConfigs.Add(config);
        }
        else
        {
            var oldValue = config.Value;
            config.Value = value;
            config.UpdatedAt = DateTime.UtcNow;
            config.UpdatedById = actorId;

            await audit.Log(actorId, "UpdatePolicy", "PolicyConfig", null, $"{key}: {oldValue} -> {value}", null);
        }

        await db.SaveChangesAsync();
        return true;
    }

    public async Task SeedDefaults()
    {
        foreach (var (key, (value, description)) in Defaults)
        {
            if (!await db.PolicyConfigs.AnyAsync(p => p.Key == key))
            {
                db.PolicyConfigs.Add(new PolicyConfig
                {
                    Key = key,
                    Value = value,
                    Description = description,
                    UpdatedAt = DateTime.UtcNow,
                });
            }
        }
        await db.SaveChangesAsync();
    }
}
