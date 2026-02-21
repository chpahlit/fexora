using Fexora.Core.DTOs.Admin;

namespace Fexora.Core.Interfaces;

public interface IPolicyService
{
    Task<List<PolicyConfigResponse>> GetAll();
    Task<string?> GetValue(string key);
    Task<bool> SetValue(string key, string value, Guid actorId);
    Task SeedDefaults();
}
