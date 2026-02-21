using Fexora.Core.DTOs.Admin;

namespace Fexora.Core.Interfaces;

public interface IAgencyService
{
    Task<List<AgencyResponse>> GetAll();
    Task<AgencyResponse?> GetById(Guid agencyId);
    Task<Guid> Create(CreateAgencyRequest request);
    Task<bool> Update(Guid agencyId, UpdateAgencyRequest request);
    Task<List<AgencyModeratorResponse>> GetModerators(Guid agencyId);
    Task<bool> AddModerator(Guid agencyId, AddAgencyModeratorRequest request);
    Task<bool> RemoveModerator(Guid agencyId, Guid moderatorId);
}
