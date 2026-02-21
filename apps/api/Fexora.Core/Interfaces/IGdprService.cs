using Fexora.Core.DTOs.Gdpr;

namespace Fexora.Core.Interfaces;

public interface IGdprService
{
    Task UpdateConsent(Guid userId, ConsentRequest request);
    Task<DataExportResponse> ExportData(Guid userId);
    Task RequestDataDeletion(Guid userId);
}
