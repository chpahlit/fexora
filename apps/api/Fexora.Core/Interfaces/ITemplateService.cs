using Fexora.Core.DTOs;
using Fexora.Core.Entities;

namespace Fexora.Core.Interfaces;

public interface ITemplateService
{
    Task<MessageTemplate> CreateAsync(string name, string bodyText, string? variablesJson, string? abGroup);
    Task<MessageTemplate?> GetAsync(Guid id);
    Task<PaginatedResult<MessageTemplate>> ListAsync(int page, int pageSize);
    Task UpdateAsync(Guid id, string? name, string? bodyText);
    Task DeleteAsync(Guid id);
    Task<string> RenderAsync(Guid templateId, Dictionary<string, string> variables);
}
