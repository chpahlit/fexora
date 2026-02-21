using Fexora.Core.Entities;

namespace Fexora.Core.Interfaces;

public interface ITokenService
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
}
