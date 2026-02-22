namespace Fexora.Core.Interfaces;

public interface ITargetingService
{
    Task<int> PreviewSegmentSizeAsync(string queryJson);
    Task<List<Guid>> GetSegmentUserIdsAsync(string queryJson, int? limit = null);
}
