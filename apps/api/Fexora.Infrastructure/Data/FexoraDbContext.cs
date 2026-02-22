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

    // Social Features
    public DbSet<Like> Likes => Set<Like>();
    public DbSet<Comment> Comments => Set<Comment>();
    public DbSet<Follow> Follows => Set<Follow>();
    public DbSet<Share> Shares => Set<Share>();
    public DbSet<Tag> Tags => Set<Tag>();
    public DbSet<ContentTag> ContentTags => Set<ContentTag>();
    public DbSet<TrendingSnapshot> TrendingSnapshots => Set<TrendingSnapshot>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<Favorite> Favorites => Set<Favorite>();
    public DbSet<FeedEvent> FeedEvents => Set<FeedEvent>();

    // Chat & Monetization
    public DbSet<CreatorChatSettings> CreatorChatSettings => Set<CreatorChatSettings>();
    public DbSet<SubscriptionTier> SubscriptionTiers => Set<SubscriptionTier>();
    public DbSet<Subscription> Subscriptions => Set<Subscription>();
    public DbSet<Tip> Tips => Set<Tip>();
    public DbSet<GiftItem> GiftItems => Set<GiftItem>();
    public DbSet<PpvMessage> PpvMessages => Set<PpvMessage>();
    public DbSet<PpvUnlock> PpvUnlocks => Set<PpvUnlock>();
    public DbSet<CustomRequest> CustomRequests => Set<CustomRequest>();

    // Referral & Promo
    public DbSet<ReferralCode> ReferralCodes => Set<ReferralCode>();
    public DbSet<ReferralRedemption> ReferralRedemptions => Set<ReferralRedemption>();
    public DbSet<PromoCode> PromoCodes => Set<PromoCode>();
    public DbSet<PromoRedemption> PromoRedemptions => Set<PromoRedemption>();

    // Blocking & Security
    public DbSet<BlockedUser> BlockedUsers => Set<BlockedUser>();
    public DbSet<TwoFactorAuth> TwoFactorAuths => Set<TwoFactorAuth>();

    // Auth
    public DbSet<PasswordResetToken> PasswordResetTokens => Set<PasswordResetToken>();

    // Orchestrator
    public DbSet<Scenario> Scenarios => Set<Scenario>();
    public DbSet<ScenarioStep> ScenarioSteps => Set<ScenarioStep>();
    public DbSet<ScenarioEnrollment> ScenarioEnrollments => Set<ScenarioEnrollment>();
    public DbSet<ScenarioExecution> ScenarioExecutions => Set<ScenarioExecution>();
    public DbSet<MessageTemplate> MessageTemplates => Set<MessageTemplate>();
    public DbSet<OrchestratorBlacklist> OrchestratorBlacklists => Set<OrchestratorBlacklist>();
    public DbSet<Broadcast> Broadcasts => Set<Broadcast>();
    public DbSet<BroadcastVariant> BroadcastVariants => Set<BroadcastVariant>();
    public DbSet<BroadcastExecution> BroadcastExecutions => Set<BroadcastExecution>();

    // Push & Social
    public DbSet<PushSubscription> PushSubscriptions => Set<PushSubscription>();
    public DbSet<SocialLogin> SocialLogins => Set<SocialLogin>();

    // Content Extensions
    public DbSet<ContentMedia> ContentMedia => Set<ContentMedia>();
    public DbSet<ScheduledContent> ScheduledContents => Set<ScheduledContent>();
    public DbSet<DmcaReport> DmcaReports => Set<DmcaReport>();
    public DbSet<Bundle> Bundles => Set<Bundle>();
    public DbSet<BundleContent> BundleContents => Set<BundleContent>();

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

        // ===== Social Features =====

        // Like (polymorphic: ContentId OR CommentId)
        modelBuilder.Entity<Like>(e =>
        {
            e.HasKey(l => l.Id);
            e.HasOne(l => l.User).WithMany(u => u.Likes).HasForeignKey(l => l.UserId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(l => l.Content).WithMany(c => c.Likes).HasForeignKey(l => l.ContentId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(l => l.Comment).WithMany(c => c.Likes).HasForeignKey(l => l.CommentId).OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(l => new { l.UserId, l.ContentId }).IsUnique().HasFilter("\"ContentId\" IS NOT NULL");
            e.HasIndex(l => new { l.UserId, l.CommentId }).IsUnique().HasFilter("\"CommentId\" IS NOT NULL");
        });

        // Comment
        modelBuilder.Entity<Comment>(e =>
        {
            e.HasKey(c => c.Id);
            e.HasOne(c => c.User).WithMany(u => u.Comments).HasForeignKey(c => c.UserId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(c => c.Content).WithMany(c2 => c2.Comments).HasForeignKey(c => c.ContentId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(c => c.Parent).WithMany(c2 => c2.Replies).HasForeignKey(c => c.ParentId).OnDelete(DeleteBehavior.Restrict);
            e.HasIndex(c => new { c.ContentId, c.ParentId, c.CreatedAt });
        });

        // Follow
        modelBuilder.Entity<Follow>(e =>
        {
            e.HasKey(f => f.Id);
            e.HasOne(f => f.Follower).WithMany(u => u.Following).HasForeignKey(f => f.FollowerId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(f => f.Followee).WithMany(u => u.Followers).HasForeignKey(f => f.FolloweeId).OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(f => new { f.FollowerId, f.FolloweeId }).IsUnique();
        });

        // Share
        modelBuilder.Entity<Share>(e =>
        {
            e.HasKey(s => s.Id);
            e.HasOne(s => s.User).WithMany().HasForeignKey(s => s.UserId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(s => s.Content).WithMany(c => c.Shares).HasForeignKey(s => s.ContentId).OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(s => s.ContentId);
        });

        // Tag
        modelBuilder.Entity<Tag>(e =>
        {
            e.HasKey(t => t.Id);
            e.HasIndex(t => t.Name).IsUnique();
        });

        // ContentTag (composite key)
        modelBuilder.Entity<ContentTag>(e =>
        {
            e.HasKey(ct => new { ct.ContentId, ct.TagId });
            e.HasOne(ct => ct.Content).WithMany(c => c.Tags).HasForeignKey(ct => ct.ContentId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(ct => ct.Tag).WithMany(t => t.ContentTags).HasForeignKey(ct => ct.TagId).OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(ct => ct.TagId);
        });

        // TrendingSnapshot
        modelBuilder.Entity<TrendingSnapshot>(e =>
        {
            e.HasKey(t => t.Id);
            e.HasIndex(t => new { t.EntityType, t.Period, t.SnapshotDate });
        });

        // Notification
        modelBuilder.Entity<Notification>(e =>
        {
            e.HasKey(n => n.Id);
            e.Property(n => n.Type).HasConversion<string>();
            e.HasOne(n => n.User).WithMany(u => u.Notifications).HasForeignKey(n => n.UserId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(n => n.Actor).WithMany().HasForeignKey(n => n.ActorId).OnDelete(DeleteBehavior.SetNull);
            e.HasIndex(n => new { n.UserId, n.ReadAt, n.CreatedAt });
        });

        // Favorite
        modelBuilder.Entity<Favorite>(e =>
        {
            e.HasKey(f => f.Id);
            e.HasOne(f => f.User).WithMany(u => u.Favorites).HasForeignKey(f => f.UserId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(f => f.Content).WithMany(c => c.Favorites).HasForeignKey(f => f.ContentId).OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(f => new { f.UserId, f.ContentId }).IsUnique();
        });

        // FeedEvent
        modelBuilder.Entity<FeedEvent>(e =>
        {
            e.HasKey(f => f.Id);
            e.HasOne(f => f.User).WithMany().HasForeignKey(f => f.UserId).OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(f => new { f.UserId, f.CreatedAt });
        });

        // ===== Chat & Monetization =====

        // CreatorChatSettings (1:1 with User)
        modelBuilder.Entity<CreatorChatSettings>(e =>
        {
            e.HasKey(s => s.CreatorId);
            e.HasOne(s => s.Creator).WithOne().HasForeignKey<CreatorChatSettings>(s => s.CreatorId);
        });

        // SubscriptionTier
        modelBuilder.Entity<SubscriptionTier>(e =>
        {
            e.HasKey(t => t.Id);
            e.Property(t => t.PriceEurMonthly).HasPrecision(18, 2);
            e.HasOne(t => t.Creator).WithMany().HasForeignKey(t => t.CreatorId).OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(t => new { t.CreatorId, t.SortOrder });
        });

        // Subscription
        modelBuilder.Entity<Subscription>(e =>
        {
            e.HasKey(s => s.Id);
            e.Property(s => s.Status).HasConversion<string>();
            e.HasOne(s => s.User).WithMany(u => u.Subscriptions).HasForeignKey(s => s.UserId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(s => s.Creator).WithMany().HasForeignKey(s => s.CreatorId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(s => s.Tier).WithMany(t => t.Subscriptions).HasForeignKey(s => s.TierId).OnDelete(DeleteBehavior.Restrict);
            e.HasIndex(s => new { s.UserId, s.CreatorId, s.Status });
        });

        // Tip
        modelBuilder.Entity<Tip>(e =>
        {
            e.HasKey(t => t.Id);
            e.HasOne(t => t.Sender).WithMany().HasForeignKey(t => t.SenderId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(t => t.Recipient).WithMany().HasForeignKey(t => t.RecipientId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(t => t.Thread).WithMany().HasForeignKey(t => t.ThreadId).OnDelete(DeleteBehavior.SetNull);
            e.HasIndex(t => t.CreatedAt);
        });

        // GiftItem
        modelBuilder.Entity<GiftItem>(e =>
        {
            e.HasKey(g => g.Id);
            e.HasIndex(g => g.SortOrder);
        });

        // PpvMessage (1:1 extension on Message)
        modelBuilder.Entity<PpvMessage>(e =>
        {
            e.HasKey(p => p.Id);
            e.HasOne(p => p.Message).WithOne().HasForeignKey<PpvMessage>(p => p.MessageId);
        });

        // PpvUnlock
        modelBuilder.Entity<PpvUnlock>(e =>
        {
            e.HasKey(p => p.Id);
            e.HasOne(p => p.PpvMessage).WithMany(m => m.Unlocks).HasForeignKey(p => p.PpvMessageId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(p => p.User).WithMany().HasForeignKey(p => p.UserId).OnDelete(DeleteBehavior.Restrict);
            e.HasIndex(p => new { p.PpvMessageId, p.UserId }).IsUnique();
        });

        // CustomRequest
        modelBuilder.Entity<CustomRequest>(e =>
        {
            e.HasKey(r => r.Id);
            e.Property(r => r.Status).HasConversion<string>();
            e.HasOne(r => r.Requester).WithMany().HasForeignKey(r => r.RequesterId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(r => r.Creator).WithMany().HasForeignKey(r => r.CreatorId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(r => r.DeliveredContent).WithMany().HasForeignKey(r => r.DeliveredContentId).OnDelete(DeleteBehavior.SetNull);
            e.HasIndex(r => new { r.CreatorId, r.Status });
        });

        // ===== Referral & Promo =====

        // ReferralCode
        modelBuilder.Entity<ReferralCode>(e =>
        {
            e.HasKey(r => r.Id);
            e.HasOne(r => r.User).WithMany().HasForeignKey(r => r.UserId).OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(r => r.Code).IsUnique();
        });

        // ReferralRedemption
        modelBuilder.Entity<ReferralRedemption>(e =>
        {
            e.HasKey(r => r.Id);
            e.HasOne(r => r.ReferralCode).WithMany(c => c.Redemptions).HasForeignKey(r => r.ReferralCodeId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(r => r.RedeemedByUser).WithMany().HasForeignKey(r => r.RedeemedByUserId).OnDelete(DeleteBehavior.Restrict);
            e.HasIndex(r => r.RedeemedByUserId).IsUnique();
        });

        // PromoCode
        modelBuilder.Entity<PromoCode>(e =>
        {
            e.HasKey(p => p.Id);
            e.HasOne(p => p.Creator).WithMany().HasForeignKey(p => p.CreatorId).OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(p => p.Code).IsUnique();
        });

        // PromoRedemption
        modelBuilder.Entity<PromoRedemption>(e =>
        {
            e.HasKey(p => p.Id);
            e.HasOne(p => p.PromoCode).WithMany(c => c.Redemptions).HasForeignKey(p => p.PromoCodeId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(p => p.User).WithMany().HasForeignKey(p => p.UserId).OnDelete(DeleteBehavior.Restrict);
        });

        // ===== Blocking & Security =====

        // BlockedUser
        modelBuilder.Entity<BlockedUser>(e =>
        {
            e.HasKey(b => b.Id);
            e.HasOne(b => b.Blocker).WithMany().HasForeignKey(b => b.BlockerId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(b => b.Blocked).WithMany().HasForeignKey(b => b.BlockedId).OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(b => new { b.BlockerId, b.BlockedId }).IsUnique();
            e.HasIndex(b => b.BlockedId);
        });

        // TwoFactorAuth (1:1 with User)
        modelBuilder.Entity<TwoFactorAuth>(e =>
        {
            e.HasKey(t => t.UserId);
            e.HasOne(t => t.User).WithOne(u => u.TwoFactorAuth).HasForeignKey<TwoFactorAuth>(t => t.UserId);
        });

        // ===== Content Extensions =====

        // ContentMedia
        modelBuilder.Entity<ContentMedia>(e =>
        {
            e.HasKey(m => m.Id);
            e.Property(m => m.MediaType).HasConversion<string>();
            e.HasOne(m => m.Content).WithMany(c => c.Media).HasForeignKey(m => m.ContentId).OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(m => new { m.ContentId, m.SortOrder });
        });

        // ScheduledContent
        modelBuilder.Entity<ScheduledContent>(e =>
        {
            e.HasKey(s => s.Id);
            e.HasOne(s => s.Content).WithOne().HasForeignKey<ScheduledContent>(s => s.ContentId);
            e.HasIndex(s => new { s.ScheduledAt, s.IsPublished });
        });

        // DmcaReport
        modelBuilder.Entity<DmcaReport>(e =>
        {
            e.HasKey(d => d.Id);
            e.Property(d => d.Status).HasConversion<string>();
            e.HasOne(d => d.Reporter).WithMany().HasForeignKey(d => d.ReporterId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(d => d.Content).WithMany().HasForeignKey(d => d.ContentId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(d => d.ReviewedBy).WithMany().HasForeignKey(d => d.ReviewedById).OnDelete(DeleteBehavior.SetNull);
            e.HasIndex(d => d.Status);
        });

        // Bundle
        modelBuilder.Entity<Bundle>(e =>
        {
            e.HasKey(b => b.Id);
            e.HasOne(b => b.Creator).WithMany().HasForeignKey(b => b.CreatorId).OnDelete(DeleteBehavior.Cascade);
        });

        // BundleContent (composite key)
        modelBuilder.Entity<BundleContent>(e =>
        {
            e.HasKey(bc => new { bc.BundleId, bc.ContentId });
            e.HasOne(bc => bc.Bundle).WithMany(b => b.Contents).HasForeignKey(bc => bc.BundleId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(bc => bc.Content).WithMany().HasForeignKey(bc => bc.ContentId).OnDelete(DeleteBehavior.Cascade);
        });

        // ===== Auth =====

        // PasswordResetToken
        modelBuilder.Entity<PasswordResetToken>(e =>
        {
            e.HasKey(t => t.Id);
            e.HasIndex(t => t.Token).IsUnique();
            e.HasOne(t => t.User).WithMany().HasForeignKey(t => t.UserId).OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(t => t.ExpiresAt);
        });

        // ===== Orchestrator =====

        // Scenario
        modelBuilder.Entity<Scenario>(e =>
        {
            e.HasKey(s => s.Id);
            e.Property(s => s.Status).HasConversion<string>();
            e.HasIndex(s => s.Status);
        });

        // ScenarioStep
        modelBuilder.Entity<ScenarioStep>(e =>
        {
            e.HasKey(s => s.Id);
            e.Property(s => s.ActionType).HasConversion<string>();
            e.HasOne(s => s.Scenario).WithMany(sc => sc.Steps).HasForeignKey(s => s.ScenarioId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(s => s.Template).WithMany().HasForeignKey(s => s.TemplateId).OnDelete(DeleteBehavior.SetNull);
            e.HasIndex(s => new { s.ScenarioId, s.StepOrder });
        });

        // ScenarioEnrollment
        modelBuilder.Entity<ScenarioEnrollment>(e =>
        {
            e.HasKey(en => en.Id);
            e.Property(en => en.Status).HasConversion<string>();
            e.HasOne(en => en.Scenario).WithMany(s => s.Enrollments).HasForeignKey(en => en.ScenarioId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(en => en.User).WithMany().HasForeignKey(en => en.UserId).OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(en => new { en.UserId, en.ScenarioId }).IsUnique();
            e.HasIndex(en => new { en.Status, en.CurrentStepIndex });
        });

        // ScenarioExecution
        modelBuilder.Entity<ScenarioExecution>(e =>
        {
            e.HasKey(ex => ex.Id);
            e.Property(ex => ex.Result).HasConversion<string>();
            e.HasOne(ex => ex.Enrollment).WithMany(en => en.Executions).HasForeignKey(ex => ex.EnrollmentId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(ex => ex.Step).WithMany().HasForeignKey(ex => ex.StepId).OnDelete(DeleteBehavior.Restrict);
            e.HasIndex(ex => new { ex.ScheduledAt, ex.Result });
        });

        // MessageTemplate
        modelBuilder.Entity<MessageTemplate>(e =>
        {
            e.HasKey(t => t.Id);
            e.HasIndex(t => t.Name);
        });

        // OrchestratorBlacklist
        modelBuilder.Entity<OrchestratorBlacklist>(e =>
        {
            e.HasKey(b => b.Id);
            e.HasOne(b => b.User).WithMany().HasForeignKey(b => b.UserId).OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(b => b.UserId).IsUnique();
        });

        // Broadcast
        modelBuilder.Entity<Broadcast>(e =>
        {
            e.HasKey(b => b.Id);
            e.Property(b => b.Status).HasConversion<string>();
            e.HasIndex(b => b.Status);
            e.HasIndex(b => b.ScheduledAt);
        });

        // BroadcastVariant
        modelBuilder.Entity<BroadcastVariant>(e =>
        {
            e.HasKey(v => v.Id);
            e.HasOne(v => v.Broadcast).WithMany(b => b.Variants).HasForeignKey(v => v.BroadcastId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(v => v.Template).WithMany().HasForeignKey(v => v.TemplateId).OnDelete(DeleteBehavior.Restrict);
        });

        // BroadcastExecution
        modelBuilder.Entity<BroadcastExecution>(e =>
        {
            e.HasKey(ex => ex.Id);
            e.Property(ex => ex.Result).HasConversion<string>();
            e.HasOne(ex => ex.Broadcast).WithMany(b => b.Executions).HasForeignKey(ex => ex.BroadcastId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(ex => ex.Variant).WithMany().HasForeignKey(ex => ex.VariantId).OnDelete(DeleteBehavior.Restrict);
            e.HasIndex(ex => new { ex.BroadcastId, ex.UserId }).IsUnique();
        });

        // ===== Push & Social =====

        // PushSubscription
        modelBuilder.Entity<PushSubscription>(e =>
        {
            e.HasKey(p => p.Id);
            e.HasOne(p => p.User).WithMany().HasForeignKey(p => p.UserId).OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(p => new { p.UserId, p.Endpoint }).IsUnique();
        });

        // SocialLogin
        modelBuilder.Entity<SocialLogin>(e =>
        {
            e.HasKey(s => s.Id);
            e.HasOne(s => s.User).WithMany().HasForeignKey(s => s.UserId).OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(s => new { s.Provider, s.ProviderUserId }).IsUnique();
            e.HasIndex(s => s.UserId);
        });
    }
}
