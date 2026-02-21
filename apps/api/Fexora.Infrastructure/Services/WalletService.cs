using Fexora.Core.DTOs;
using Fexora.Core.DTOs.Wallet;
using Fexora.Core.Entities;
using Fexora.Core.Interfaces;
using Fexora.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Stripe;
using Stripe.Checkout;

namespace Fexora.Infrastructure.Services;

public class WalletService(FexoraDbContext db, IConfiguration config, IAttributionService attribution) : IWalletService
{
    private static readonly Dictionary<string, (int Credits, long PriceCents, string Name)> CreditPacks = new()
    {
        ["pack_50"]   = (50,   499,  "50 Credits"),
        ["pack_150"]  = (150,  1299, "150 Credits"),
        ["pack_500"]  = (500,  3999, "500 Credits"),
        ["pack_1200"] = (1200, 7999, "1200 Credits"),
    };

    public async Task<WalletResponse> GetBalanceAsync(Guid userId)
    {
        var wallet = await db.CreditWallets.FindAsync(userId)
            ?? throw new KeyNotFoundException("Wallet nicht gefunden.");

        return new WalletResponse { Balance = wallet.Balance, UpdatedAt = wallet.UpdatedAt };
    }

    public async Task<PaginatedResult<TransactionResponse>> GetTransactionsAsync(Guid userId, int page, int pageSize)
    {
        var query = db.CreditTransactions
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.CreatedAt);

        var total = await query.CountAsync();
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(t => new TransactionResponse
            {
                Id = t.Id,
                Type = t.Type.ToString(),
                Amount = t.Amount,
                GatewayRef = t.GatewayRef,
                CreatedAt = t.CreatedAt
            })
            .ToListAsync();

        return new PaginatedResult<TransactionResponse>
        {
            Data = items, Total = total, Page = page, PageSize = pageSize
        };
    }

    public async Task<TopupResponse> CreateTopupSessionAsync(Guid userId, string packId)
    {
        if (!CreditPacks.TryGetValue(packId, out var pack))
            throw new ArgumentException($"Ungültiges Credit-Pack: {packId}");

        StripeConfiguration.ApiKey = config["Stripe:SecretKey"];

        var options = new SessionCreateOptions
        {
            PaymentMethodTypes = ["card"],
            LineItems =
            [
                new SessionLineItemOptions
                {
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        Currency = "eur",
                        UnitAmount = pack.PriceCents,
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = pack.Name,
                            Description = $"{pack.Credits} Fexora Credits",
                        }
                    },
                    Quantity = 1,
                }
            ],
            Mode = "payment",
            SuccessUrl = config["Stripe:SuccessUrl"] ?? "http://localhost:3000/wallet?success=true",
            CancelUrl = config["Stripe:CancelUrl"] ?? "http://localhost:3000/wallet?canceled=true",
            Metadata = new Dictionary<string, string>
            {
                ["userId"] = userId.ToString(),
                ["packId"] = packId,
                ["credits"] = pack.Credits.ToString()
            }
        };

        var service = new SessionService();
        var session = await service.CreateAsync(options);

        return new TopupResponse
        {
            CheckoutUrl = session.Url,
            SessionId = session.Id
        };
    }

    public async Task HandleStripeWebhookAsync(string json, string signature)
    {
        var webhookSecret = config["Stripe:WebhookSecret"]!;
        var stripeEvent = EventUtility.ConstructEvent(json, signature, webhookSecret);

        if (stripeEvent.Type == EventTypes.CheckoutSessionCompleted)
        {
            var session = stripeEvent.Data.Object as Session;
            if (session?.Metadata == null) return;

            var userId = Guid.Parse(session.Metadata["userId"]);
            var credits = int.Parse(session.Metadata["credits"]);

            var wallet = await db.CreditWallets.FindAsync(userId);
            if (wallet is null) return;

            wallet.Balance += credits;
            wallet.UpdatedAt = DateTime.UtcNow;

            db.CreditTransactions.Add(new CreditTransaction
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Type = CreditTransactionType.Topup,
                Amount = credits,
                GatewayRef = session.Id,
                CreatedAt = DateTime.UtcNow
            });

            await db.SaveChangesAsync();
        }
    }

    public async Task<UnlockResponse> UnlockContentAsync(Guid buyerId, Guid contentId)
    {
        var content = await db.Contents.FindAsync(contentId)
            ?? throw new KeyNotFoundException("Content nicht gefunden.");

        if (content.OwnerId == buyerId)
            throw new InvalidOperationException("Du kannst deinen eigenen Content nicht kaufen.");

        if (await db.Purchases.AnyAsync(p => p.BuyerId == buyerId && p.ContentId == contentId))
            throw new InvalidOperationException("Du hast diesen Content bereits freigeschaltet.");

        var wallet = await db.CreditWallets.FindAsync(buyerId)
            ?? throw new KeyNotFoundException("Wallet nicht gefunden.");

        if (wallet.Balance < content.PriceCredits)
            throw new InvalidOperationException($"Nicht genügend Credits. Benötigt: {content.PriceCredits}, Verfügbar: {wallet.Balance}");

        // Deduct credits
        wallet.Balance -= content.PriceCredits;
        wallet.UpdatedAt = DateTime.UtcNow;

        // Record transaction
        db.CreditTransactions.Add(new CreditTransaction
        {
            Id = Guid.NewGuid(),
            UserId = buyerId,
            Type = CreditTransactionType.Purchase,
            Amount = -content.PriceCredits,
            CreatedAt = DateTime.UtcNow
        });

        // Record purchase
        var purchase = new Core.Entities.Purchase
        {
            Id = Guid.NewGuid(),
            BuyerId = buyerId,
            ContentId = contentId,
            PriceCredits = content.PriceCredits,
            CreatedAt = DateTime.UtcNow
        };
        db.Purchases.Add(purchase);

        await db.SaveChangesAsync();

        // Attribution: check if a moderator interacted with buyer within 30 min
        var moderatorId = await attribution.FindAttributableModerator(buyerId, windowMinutes: 30);
        if (moderatorId.HasValue)
        {
            var windowSec = 30 * 60;
            await attribution.AttributePurchase(purchase.Id, moderatorId.Value, windowSec);
        }

        return new UnlockResponse
        {
            Success = true,
            NewBalance = wallet.Balance,
            PurchaseId = purchase.Id
        };
    }
}
