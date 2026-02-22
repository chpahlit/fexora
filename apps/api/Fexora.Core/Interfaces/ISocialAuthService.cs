using Fexora.Core.Entities;

namespace Fexora.Core.Interfaces;

public interface ISocialAuthService
{
    Task<(User user, string accessToken, string refreshToken)> LoginWithGoogleAsync(string idToken);
    Task<(User user, string accessToken, string refreshToken)> LoginWithAppleAsync(string idToken, string? name);
    Task LinkSocialAsync(Guid userId, string provider, string providerUserId, string? email);
    Task UnlinkSocialAsync(Guid userId, string provider);
}
