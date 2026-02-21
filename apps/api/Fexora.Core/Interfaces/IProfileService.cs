using Fexora.Core.DTOs.Profile;

namespace Fexora.Core.Interfaces;

public interface IProfileService
{
    Task<ProfileResponse?> GetByUserIdAsync(Guid userId);
    Task<ProfileResponse?> GetByUsernameAsync(string username);
    Task<ProfileResponse> UpdateAsync(Guid userId, UpdateProfileRequest request);
    Task<string> UpdateAvatarAsync(Guid userId, Stream fileStream, string fileName, string contentType);
}
