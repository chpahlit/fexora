using Fexora.Core.DTOs.Profile;
using Fexora.Core.Interfaces;
using Fexora.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Fexora.Infrastructure.Services;

public class ProfileService(FexoraDbContext db, IStorageService storage) : IProfileService
{
    private const string AvatarBucket = "avatars";

    public async Task<ProfileResponse?> GetByUserIdAsync(Guid userId)
    {
        var profile = await db.Profiles
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.UserId == userId);

        return profile is null ? null : MapToResponse(profile);
    }

    public async Task<ProfileResponse?> GetByUsernameAsync(string username)
    {
        var profile = await db.Profiles
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.Username == username);

        return profile is null ? null : MapToResponse(profile);
    }

    public async Task<ProfileResponse> UpdateAsync(Guid userId, UpdateProfileRequest request)
    {
        var profile = await db.Profiles
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.UserId == userId)
            ?? throw new KeyNotFoundException("Profil nicht gefunden.");

        if (request.Username is not null && request.Username != profile.Username)
        {
            if (await db.Profiles.AnyAsync(p => p.Username == request.Username && p.UserId != userId))
                throw new ArgumentException("Dieser Benutzername ist bereits vergeben.");
            profile.Username = request.Username.Trim();
        }

        if (request.Age is not null) profile.Age = request.Age;
        if (request.Country is not null) profile.Country = request.Country;
        if (request.OffersCustom is not null) profile.OffersCustom = request.OffersCustom.Value;
        if (request.Bio is not null) profile.Bio = request.Bio;

        profile.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();

        return MapToResponse(profile);
    }

    public async Task<string> UpdateAvatarAsync(Guid userId, Stream fileStream, string fileName, string contentType)
    {
        var profile = await db.Profiles.FindAsync(userId)
            ?? throw new KeyNotFoundException("Profil nicht gefunden.");

        var key = $"{userId}/{Guid.NewGuid()}{Path.GetExtension(fileName)}";
        var url = await storage.UploadAsync(AvatarBucket, key, fileStream, contentType);

        profile.AvatarUrl = url;
        profile.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();

        return url;
    }

    private static ProfileResponse MapToResponse(Core.Entities.Profile profile) => new()
    {
        UserId = profile.UserId,
        Username = profile.Username,
        Age = profile.Age,
        Country = profile.Country,
        Badges = profile.Badges,
        OffersCustom = profile.OffersCustom,
        Bio = profile.Bio,
        AvatarUrl = profile.AvatarUrl,
        Role = profile.User.Role.ToString(),
        CreatedAt = profile.User.CreatedAt
    };
}
