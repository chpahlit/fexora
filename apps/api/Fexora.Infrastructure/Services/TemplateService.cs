using System.Text.RegularExpressions;
using Fexora.Core.DTOs;
using Fexora.Core.Entities;
using Fexora.Core.Interfaces;
using Fexora.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Fexora.Infrastructure.Services;

public partial class TemplateService(FexoraDbContext db) : ITemplateService
{
    [GeneratedRegex(@"\{\{(\w+)\}\}")]
    private static partial Regex VariablePattern();

    public async Task<MessageTemplate> CreateAsync(string name, string bodyText, string? variablesJson, string? abGroup)
    {
        var template = new MessageTemplate
        {
            Name = name,
            BodyText = bodyText,
            VariablesJson = variablesJson,
            AbGroup = abGroup
        };
        db.MessageTemplates.Add(template);
        await db.SaveChangesAsync();
        return template;
    }

    public async Task<MessageTemplate?> GetAsync(Guid id)
    {
        return await db.MessageTemplates.FindAsync(id);
    }

    public async Task<PaginatedResult<MessageTemplate>> ListAsync(int page, int pageSize)
    {
        var query = db.MessageTemplates.OrderByDescending(t => t.CreatedAt);
        var total = await query.CountAsync();
        var data = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        return new PaginatedResult<MessageTemplate> { Data = data, Total = total, Page = page, PageSize = pageSize };
    }

    public async Task UpdateAsync(Guid id, string? name, string? bodyText)
    {
        var template = await db.MessageTemplates.FindAsync(id)
            ?? throw new ArgumentException("Template not found.");
        if (name is not null) template.Name = name;
        if (bodyText is not null) template.BodyText = bodyText;
        template.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var template = await db.MessageTemplates.FindAsync(id);
        if (template is not null)
        {
            db.MessageTemplates.Remove(template);
            await db.SaveChangesAsync();
        }
    }

    public Task<string> RenderAsync(Guid templateId, Dictionary<string, string> variables)
    {
        return RenderInternalAsync(templateId, variables);
    }

    private async Task<string> RenderInternalAsync(Guid templateId, Dictionary<string, string> variables)
    {
        var template = await db.MessageTemplates.FindAsync(templateId)
            ?? throw new ArgumentException("Template not found.");

        var result = VariablePattern().Replace(template.BodyText, match =>
        {
            var key = match.Groups[1].Value;
            return variables.TryGetValue(key, out var value) ? value : match.Value;
        });

        return result;
    }
}
