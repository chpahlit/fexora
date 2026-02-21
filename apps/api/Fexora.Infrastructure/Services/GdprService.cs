using Fexora.Core.DTOs.Gdpr;
using Fexora.Core.Interfaces;
using Fexora.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Fexora.Infrastructure.Services;

public class GdprService(FexoraDbContext db) : IGdprService
{
    public async Task UpdateConsent(Guid userId, ConsentRequest request)
    {
        var user = await db.Users.FindAsync(userId)
            ?? throw new KeyNotFoundException("User nicht gefunden.");

        user.ConsentPrivacyPolicy = request.ConsentPrivacyPolicy;
        user.ConsentTermsOfService = request.ConsentTermsOfService;
        user.ConsentGivenAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
    }

    public async Task<DataExportResponse> ExportData(Guid userId)
    {
        var user = await db.Users
            .Include(u => u.Profile)
            .FirstOrDefaultAsync(u => u.Id == userId)
            ?? throw new KeyNotFoundException("User nicht gefunden.");

        var contents = await db.Contents
            .Where(c => c.OwnerId == userId)
            .Select(c => new ContentExportData
            {
                Title = c.Title,
                Type = c.Type.ToString(),
                PriceCredits = c.PriceCredits,
                Status = c.Status.ToString(),
                CreatedAt = c.CreatedAt,
            })
            .ToListAsync();

        var transactions = await db.CreditTransactions
            .Where(t => t.UserId == userId)
            .Select(t => new TransactionExportData
            {
                Type = t.Type.ToString(),
                Amount = t.Amount,
                CreatedAt = t.CreatedAt,
            })
            .ToListAsync();

        var messages = await db.Messages
            .Where(m => m.SenderId == userId)
            .Select(m => new MessageExportData
            {
                Body = m.Body,
                CreatedAt = m.CreatedAt,
            })
            .ToListAsync();

        var purchases = await db.Purchases
            .Include(p => p.Content)
            .Where(p => p.BuyerId == userId)
            .Select(p => new PurchaseExportData
            {
                ContentTitle = p.Content.Title,
                PriceCredits = p.PriceCredits,
                CreatedAt = p.CreatedAt,
            })
            .ToListAsync();

        return new DataExportResponse
        {
            User = new UserExportData
            {
                Email = user.Email,
                Role = user.Role.ToString(),
                IsVerified18 = user.IsVerified18,
                CreatedAt = user.CreatedAt,
            },
            Profile = user.Profile is not null
                ? new ProfileExportData
                {
                    Username = user.Profile.Username,
                    Age = user.Profile.Age,
                    Country = user.Profile.Country,
                    Bio = user.Profile.Bio,
                }
                : null,
            Content = contents,
            Transactions = transactions,
            Messages = messages,
            Purchases = purchases,
        };
    }

    public async Task RequestDataDeletion(Guid userId)
    {
        var user = await db.Users.FindAsync(userId)
            ?? throw new KeyNotFoundException("User nicht gefunden.");

        user.DataDeletionRequestedAt = DateTime.UtcNow;
        user.IsActive = false;
        await db.SaveChangesAsync();
    }
}
