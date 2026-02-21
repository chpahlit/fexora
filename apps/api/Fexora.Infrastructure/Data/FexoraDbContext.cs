using Fexora.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Fexora.Infrastructure.Data;

public class FexoraDbContext(DbContextOptions<FexoraDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Profile> Profiles => Set<Profile>();
    public DbSet<Content> Contents => Set<Content>();
    public DbSet<Core.Entities.Thread> Threads => Set<Core.Entities.Thread>();
    public DbSet<Message> Messages => Set<Message>();
    public DbSet<Purchase> Purchases => Set<Purchase>();
    public DbSet<CreditWallet> CreditWallets => Set<CreditWallet>();
    public DbSet<CreditTransaction> CreditTransactions => Set<CreditTransaction>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<Report> Reports => Set<Report>();
    public DbSet<PolicyConfig> PolicyConfigs => Set<PolicyConfig>();
    public DbSet<PayoutRecord> PayoutRecords => Set<PayoutRecord>();
    public DbSet<ModeratorCompensation> ModeratorCompensations => Set<ModeratorCompensation>();
    public DbSet<Agency> Agencies => Set<Agency>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User
        modelBuilder.Entity<User>(e =>
        {
            e.HasKey(u => u.Id);
            e.HasIndex(u => u.Email).IsUnique();
            e.Property(u => u.Role).HasConversion<string>();
        });

        // Profile (1:1 with User)
        modelBuilder.Entity<Profile>(e =>
        {
            e.HasKey(p => p.UserId);
            e.HasOne(p => p.User)
                .WithOne(u => u.Profile)
                .HasForeignKey<Profile>(p => p.UserId);
            e.HasIndex(p => p.Username).IsUnique();
        });

        // Content
        modelBuilder.Entity<Content>(e =>
        {
            e.HasKey(c => c.Id);
            e.Property(c => c.Type).HasConversion<string>();
            e.Property(c => c.Status).HasConversion<string>();
            e.HasOne(c => c.Owner)
                .WithMany(u => u.Contents)
                .HasForeignKey(c => c.OwnerId);
            e.HasIndex(c => c.Status);
            e.HasIndex(c => c.CreatedAt);
        });

        // Thread
        modelBuilder.Entity<Core.Entities.Thread>(e =>
        {
            e.HasKey(t => t.Id);
            e.HasOne(t => t.UserA).WithMany().HasForeignKey(t => t.UserAId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(t => t.UserB).WithMany().HasForeignKey(t => t.UserBId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(t => t.AssignedModerator).WithMany().HasForeignKey(t => t.AssignedModeratorId).OnDelete(DeleteBehavior.SetNull);
            e.HasIndex(t => t.LastActivityAt);
        });

        // Message
        modelBuilder.Entity<Message>(e =>
        {
            e.HasKey(m => m.Id);
            e.HasOne(m => m.Thread)
                .WithMany(t => t.Messages)
                .HasForeignKey(m => m.ThreadId);
            e.HasOne(m => m.Sender)
                .WithMany(u => u.SentMessages)
                .HasForeignKey(m => m.SenderId)
                .OnDelete(DeleteBehavior.Restrict);
            e.HasIndex(m => m.ThreadId);
            e.HasIndex(m => m.CreatedAt);
        });

        // CreditWallet (1:1 with User)
        modelBuilder.Entity<CreditWallet>(e =>
        {
            e.HasKey(w => w.UserId);
            e.HasOne(w => w.User)
                .WithOne(u => u.Wallet)
                .HasForeignKey<CreditWallet>(w => w.UserId);
        });

        // CreditTransaction
        modelBuilder.Entity<CreditTransaction>(e =>
        {
            e.HasKey(t => t.Id);
            e.Property(t => t.Type).HasConversion<string>();
            e.HasOne(t => t.Wallet)
                .WithMany(w => w.Transactions)
                .HasForeignKey(t => t.UserId);
            e.HasIndex(t => t.CreatedAt);
        });

        // RefreshToken
        modelBuilder.Entity<RefreshToken>(e =>
        {
            e.HasKey(r => r.Id);
            e.HasIndex(r => r.Token).IsUnique();
            e.HasOne(r => r.User)
                .WithMany(u => u.RefreshTokens)
                .HasForeignKey(r => r.UserId);
            e.HasIndex(r => r.ExpiresAt);
        });

        // Purchase
        modelBuilder.Entity<Purchase>(e =>
        {
            e.HasKey(p => p.Id);
            e.HasOne(p => p.Buyer)
                .WithMany(u => u.Purchases)
                .HasForeignKey(p => p.BuyerId)
                .OnDelete(DeleteBehavior.Restrict);
            e.HasOne(p => p.Content)
                .WithMany(c => c.Purchases)
                .HasForeignKey(p => p.ContentId)
                .OnDelete(DeleteBehavior.Restrict);
            e.HasIndex(p => p.CreatedAt);
        });

        // AuditLog
        modelBuilder.Entity<AuditLog>(e =>
        {
            e.HasKey(a => a.Id);
            e.HasOne(a => a.Actor).WithMany().HasForeignKey(a => a.ActorId).OnDelete(DeleteBehavior.Restrict);
            e.HasIndex(a => a.CreatedAt);
            e.HasIndex(a => a.EntityType);
        });

        // Report
        modelBuilder.Entity<Report>(e =>
        {
            e.HasKey(r => r.Id);
            e.Property(r => r.Reason).HasConversion<string>();
            e.Property(r => r.Status).HasConversion<string>();
            e.HasOne(r => r.Reporter).WithMany().HasForeignKey(r => r.ReporterId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(r => r.TargetUser).WithMany().HasForeignKey(r => r.TargetUserId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(r => r.TargetContent).WithMany().HasForeignKey(r => r.TargetContentId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(r => r.ReviewedBy).WithMany().HasForeignKey(r => r.ReviewedById).OnDelete(DeleteBehavior.Restrict);
            e.HasIndex(r => r.Status);
            e.HasIndex(r => r.CreatedAt);
        });

        // PolicyConfig
        modelBuilder.Entity<PolicyConfig>(e =>
        {
            e.HasKey(p => p.Key);
            e.HasOne(p => p.UpdatedBy).WithMany().HasForeignKey(p => p.UpdatedById).OnDelete(DeleteBehavior.SetNull);
        });

        // PayoutRecord
        modelBuilder.Entity<PayoutRecord>(e =>
        {
            e.HasKey(p => p.Id);
            e.Property(p => p.Status).HasConversion<string>();
            e.Property(p => p.Amount).HasPrecision(18, 2);
            e.HasOne(p => p.User).WithMany().HasForeignKey(p => p.UserId).OnDelete(DeleteBehavior.Restrict);
            e.HasIndex(p => p.Status);
            e.HasIndex(p => p.CreatedAt);
        });

        // ModeratorCompensation
        modelBuilder.Entity<ModeratorCompensation>(e =>
        {
            e.HasKey(c => c.Id);
            e.Property(c => c.FixedCompensation).HasPrecision(18, 2);
            e.Property(c => c.RevenueShare).HasPrecision(18, 2);
            e.Property(c => c.TotalCompensation).HasPrecision(18, 2);
            e.HasOne(c => c.Moderator).WithMany().HasForeignKey(c => c.ModeratorId).OnDelete(DeleteBehavior.Restrict);
            e.HasIndex(c => c.CalculatedAt);
        });

        // Agency
        modelBuilder.Entity<Agency>(e =>
        {
            e.HasKey(a => a.Id);
            e.Property(a => a.PerMessageRate).HasPrecision(18, 4);
            e.Property(a => a.RevenueSharePercent).HasPrecision(18, 4);
            e.Property(a => a.AgencyCutPercent).HasPrecision(18, 4);
            e.HasOne(a => a.Owner).WithMany().HasForeignKey(a => a.OwnerId).OnDelete(DeleteBehavior.Restrict);
            e.HasIndex(a => a.Name).IsUnique();
        });

        // AgencyModerator (composite key)
        modelBuilder.Entity<AgencyModerator>(e =>
        {
            e.HasKey(am => new { am.AgencyId, am.ModeratorId });
            e.Property(am => am.CustomPerMessageRate).HasPrecision(18, 4);
            e.Property(am => am.CustomRevenueSharePercent).HasPrecision(18, 4);
            e.HasOne(am => am.Agency).WithMany(a => a.Moderators).HasForeignKey(am => am.AgencyId);
            e.HasOne(am => am.Moderator).WithMany().HasForeignKey(am => am.ModeratorId).OnDelete(DeleteBehavior.Restrict);
        });
    }
}
