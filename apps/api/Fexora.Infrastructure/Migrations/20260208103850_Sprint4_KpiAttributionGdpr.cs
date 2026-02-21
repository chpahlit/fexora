using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Fexora.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Sprint4_KpiAttributionGdpr : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ConsentGivenAt",
                table: "Users",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "ConsentPrivacyPolicy",
                table: "Users",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ConsentTermsOfService",
                table: "Users",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "DataDeletionRequestedAt",
                table: "Users",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DataExportRequestedAt",
                table: "Users",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Agencies",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    OwnerId = table.Column<Guid>(type: "uuid", nullable: false),
                    PerMessageRate = table.Column<decimal>(type: "numeric(18,4)", precision: 18, scale: 4, nullable: false),
                    RevenueSharePercent = table.Column<decimal>(type: "numeric(18,4)", precision: 18, scale: 4, nullable: false),
                    AgencyCutPercent = table.Column<decimal>(type: "numeric(18,4)", precision: 18, scale: 4, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Agencies", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Agencies_Users_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ModeratorCompensations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ModeratorId = table.Column<Guid>(type: "uuid", nullable: false),
                    PeriodStart = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    PeriodEnd = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    TotalMessages = table.Column<int>(type: "integer", nullable: false),
                    TotalDialogs = table.Column<int>(type: "integer", nullable: false),
                    AttributedUnlocks = table.Column<int>(type: "integer", nullable: false),
                    AttributedRevenue = table.Column<int>(type: "integer", nullable: false),
                    FixedCompensation = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    RevenueShare = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    TotalCompensation = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    AvgResponseTimeSec = table.Column<double>(type: "double precision", nullable: false),
                    CalculatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ModeratorCompensations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ModeratorCompensations_Users_ModeratorId",
                        column: x => x.ModeratorId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "AgencyModerator",
                columns: table => new
                {
                    AgencyId = table.Column<Guid>(type: "uuid", nullable: false),
                    ModeratorId = table.Column<Guid>(type: "uuid", nullable: false),
                    CustomPerMessageRate = table.Column<decimal>(type: "numeric(18,4)", precision: 18, scale: 4, nullable: true),
                    CustomRevenueSharePercent = table.Column<decimal>(type: "numeric(18,4)", precision: 18, scale: 4, nullable: true),
                    JoinedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AgencyModerator", x => new { x.AgencyId, x.ModeratorId });
                    table.ForeignKey(
                        name: "FK_AgencyModerator_Agencies_AgencyId",
                        column: x => x.AgencyId,
                        principalTable: "Agencies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AgencyModerator_Users_ModeratorId",
                        column: x => x.ModeratorId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Agencies_Name",
                table: "Agencies",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Agencies_OwnerId",
                table: "Agencies",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_AgencyModerator_ModeratorId",
                table: "AgencyModerator",
                column: "ModeratorId");

            migrationBuilder.CreateIndex(
                name: "IX_ModeratorCompensations_CalculatedAt",
                table: "ModeratorCompensations",
                column: "CalculatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_ModeratorCompensations_ModeratorId",
                table: "ModeratorCompensations",
                column: "ModeratorId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AgencyModerator");

            migrationBuilder.DropTable(
                name: "ModeratorCompensations");

            migrationBuilder.DropTable(
                name: "Agencies");

            migrationBuilder.DropColumn(
                name: "ConsentGivenAt",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ConsentPrivacyPolicy",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ConsentTermsOfService",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "DataDeletionRequestedAt",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "DataExportRequestedAt",
                table: "Users");
        }
    }
}
