using Fexora.Core.DTOs;
using Fexora.Core.Entities;

namespace Fexora.Core.Interfaces;

public interface IBroadcastService
{
    Task<Broadcast> CreateAsync(string name, string targetingQueryJson, Guid senderProfileId, bool isDryRun);
    Task<Broadcast?> GetAsync(Guid id);
    Task<PaginatedResult<Broadcast>> ListAsync(int page, int pageSize);
    Task AddVariantAsync(Guid broadcastId, Guid templateId, string variantName, int weightPercent);
    Task ScheduleAsync(Guid id, DateTime? scheduledAt);
    Task AbortAsync(Guid id);
    Task<BroadcastVariant?> GetWinnerAsync(Guid broadcastId);
    Task ProcessBatchAsync(Guid broadcastId, int batchSize = 1000);
}
