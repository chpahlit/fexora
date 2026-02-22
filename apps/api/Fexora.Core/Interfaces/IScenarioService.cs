using Fexora.Core.DTOs;
using Fexora.Core.Entities;

namespace Fexora.Core.Interfaces;

public interface IScenarioService
{
    Task<Scenario> CreateAsync(string name, string? description);
    Task<Scenario?> GetAsync(Guid id);
    Task<PaginatedResult<Scenario>> ListAsync(int page, int pageSize);
    Task UpdateAsync(Guid id, string? name, string? description);
    Task ActivateAsync(Guid id);
    Task PauseAsync(Guid id);
    Task ArchiveAsync(Guid id);
    Task AddStepAsync(Guid scenarioId, ScenarioStep step);
    Task RemoveStepAsync(Guid stepId);
    Task EnrollUserAsync(Guid scenarioId, Guid userId);
    Task OptOutUserAsync(Guid userId);
    Task<List<ScenarioEnrollment>> GetDueEnrollmentsAsync(DateTime now, int batchSize);
}
