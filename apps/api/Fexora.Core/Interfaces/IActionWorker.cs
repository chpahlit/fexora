using Fexora.Core.Entities;
using Fexora.Core.Enums;

namespace Fexora.Core.Interfaces;

public interface IActionWorker
{
    ActionType ActionType { get; }
    Task<ExecutionResult> ExecuteAsync(ScenarioStep step, Guid userId);
}
