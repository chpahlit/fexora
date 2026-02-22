using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Fexora.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Sprint5_SpecializedIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Composite Feed Index (owner_id, status, created_at DESC)
            migrationBuilder.Sql(
                """
                CREATE INDEX idx_content_feed
                ON "Contents" ("OwnerId", "Status", "CreatedAt" DESC);
                """);

            // Partial Index: only approved content
            migrationBuilder.Sql(
                """
                CREATE INDEX idx_content_approved
                ON "Contents" ("CreatedAt" DESC)
                WHERE "Status" = 'Approved';
                """);

            // Partial Index: only pending content (for review queue)
            migrationBuilder.Sql(
                """
                CREATE INDEX idx_content_pending
                ON "Contents" ("CreatedAt")
                WHERE "Status" = 'Pending';
                """);

            // Trending Snapshots composite
            migrationBuilder.Sql(
                """
                CREATE INDEX idx_trending
                ON "TrendingSnapshots" ("EntityType", "Period", "SnapshotDate" DESC);
                """);

            // Notifications user index
            migrationBuilder.Sql(
                """
                CREATE INDEX idx_notifications_user
                ON "Notifications" ("UserId", "ReadAt", "CreatedAt" DESC);
                """);

            // Coin transactions per user
            migrationBuilder.Sql(
                """
                CREATE INDEX idx_coin_tx_user
                ON "CreditTransactions" ("UserId", "CreatedAt" DESC);
                """);

            // Subscription access check
            migrationBuilder.Sql(
                """
                CREATE INDEX idx_subscriptions_check
                ON "Subscriptions" ("UserId", "CreatorId", "Status");
                """);

            // Full-Text Search: Content (title)
            migrationBuilder.Sql(
                """
                CREATE INDEX idx_content_fts
                ON "Contents"
                USING GIN (to_tsvector('german', "Title"));
                """);

            // Full-Text Search: Profiles (username + bio)
            migrationBuilder.Sql(
                """
                CREATE INDEX idx_profiles_fts
                ON "Profiles"
                USING GIN (to_tsvector('german', coalesce("Username", '') || ' ' || coalesce("Bio", '')));
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP INDEX IF EXISTS idx_content_feed;");
            migrationBuilder.Sql("DROP INDEX IF EXISTS idx_content_approved;");
            migrationBuilder.Sql("DROP INDEX IF EXISTS idx_content_pending;");
            migrationBuilder.Sql("DROP INDEX IF EXISTS idx_trending;");
            migrationBuilder.Sql("DROP INDEX IF EXISTS idx_notifications_user;");
            migrationBuilder.Sql("DROP INDEX IF EXISTS idx_coin_tx_user;");
            migrationBuilder.Sql("DROP INDEX IF EXISTS idx_subscriptions_check;");
            migrationBuilder.Sql("DROP INDEX IF EXISTS idx_content_fts;");
            migrationBuilder.Sql("DROP INDEX IF EXISTS idx_profiles_fts;");
        }
    }
}
