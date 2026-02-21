using Fexora.Core.DTOs.Auth;

namespace Fexora.Core.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<AuthResponse> RefreshAsync(string refreshToken);
    Task RevokeAsync(string refreshToken);
    Task<UserInfo?> GetUserInfoAsync(Guid userId);
}
