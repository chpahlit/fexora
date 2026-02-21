using System.Text;
using Fexora.Core.Entities;
using Fexora.Core.Enums;
using Fexora.Core.Interfaces;
using Fexora.Infrastructure.Data;
using Fexora.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Database
builder.Services.AddDbContext<FexoraDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

// Redis
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration["Redis:Connection"];
});

// SignalR
builder.Services.AddSignalR()
    .AddStackExchangeRedis(builder.Configuration["Redis:Connection"] ?? "localhost:6500");

// CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(
                builder.Configuration.GetSection("Cors:Origins").Get<string[]>() ?? ["http://localhost:3000"])
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// JWT Authentication
var jwtSecret = builder.Configuration["Jwt:Secret"]!;
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
        ClockSkew = TimeSpan.Zero
    };

    // SignalR JWT support via query string
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];
            var path = context.HttpContext.Request.Path;
            if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
            {
                context.Token = accessToken;
            }
            return Task.CompletedTask;
        }
    };
});

// Authorization with role policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Admin", policy => policy.RequireRole("Admin"));
    options.AddPolicy("Moderator", policy => policy.RequireRole("Moderator", "Admin"));
    options.AddPolicy("Creator", policy => policy.RequireRole("Creator", "Moderator", "Admin"));
});

// Application Services
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProfileService, ProfileService>();
builder.Services.AddScoped<IContentService, ContentService>();
builder.Services.AddSingleton<IStorageService, MinioStorageService>();
builder.Services.AddScoped<IWalletService, WalletService>();
builder.Services.AddScoped<IChatService, ChatService>();
builder.Services.AddScoped<IAuditService, AuditService>();
builder.Services.AddScoped<IAdminUserService, AdminUserService>();
builder.Services.AddScoped<IReportService, ReportService>();
builder.Services.AddScoped<IPolicyService, PolicyService>();
builder.Services.AddScoped<IPayoutService, PayoutService>();
builder.Services.AddScoped<IAnalyticsService, AnalyticsService>();
builder.Services.AddScoped<IAttributionService, AttributionService>();
builder.Services.AddScoped<ICompensationService, CompensationService>();
builder.Services.AddScoped<IAgencyService, AgencyService>();
builder.Services.AddScoped<IGdprService, GdprService>();
builder.Services.AddSingleton<IWatermarkService, WatermarkService>();

// OpenAPI
builder.Services.AddOpenApi();

// Controllers
builder.Services.AddControllers();

// Health Checks
builder.Services.AddHealthChecks()
    .AddNpgSql(builder.Configuration.GetConnectionString("Default") ?? "")
    .AddRedis(builder.Configuration["Redis:Connection"] ?? "localhost:6500");

var app = builder.Build();

// Middleware Pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    // Auto-migrate in development
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<FexoraDbContext>();
    await db.Database.MigrateAsync();

    // Seed default policy configs
    var policyService = scope.ServiceProvider.GetRequiredService<IPolicyService>();
    await policyService.SeedDefaults();

    // Seed dev admin user
    if (!await db.Users.AnyAsync(u => u.Role == Role.Admin))
    {
        var adminId = Guid.NewGuid();
        db.Users.Add(new User
        {
            Id = adminId,
            Email = "admin@fexora.io",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
            Role = Role.Admin,
            IsVerified18 = true,
            IsActive = true,
            ConsentPrivacyPolicy = true,
            ConsentTermsOfService = true,
            ConsentGivenAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow
        });
        db.Profiles.Add(new Profile
        {
            UserId = adminId,
            Username = "admin",
            UpdatedAt = DateTime.UtcNow
        });
        db.CreditWallets.Add(new CreditWallet
        {
            UserId = adminId,
            Balance = 0,
            UpdatedAt = DateTime.UtcNow
        });
        await db.SaveChangesAsync();
        Console.WriteLine("==> Dev admin seeded: admin@fexora.io / Admin123!");
    }

    // Seed dev moderator user
    if (!await db.Users.AnyAsync(u => u.Role == Role.Moderator))
    {
        var modId = Guid.NewGuid();
        db.Users.Add(new User
        {
            Id = modId,
            Email = "mod@fexora.io",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Mod123!"),
            Role = Role.Moderator,
            IsVerified18 = true,
            IsActive = true,
            ConsentPrivacyPolicy = true,
            ConsentTermsOfService = true,
            ConsentGivenAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow
        });
        db.Profiles.Add(new Profile
        {
            UserId = modId,
            Username = "moderator",
            UpdatedAt = DateTime.UtcNow
        });
        db.CreditWallets.Add(new CreditWallet
        {
            UserId = modId,
            Balance = 0,
            UpdatedAt = DateTime.UtcNow
        });
        await db.SaveChangesAsync();
        Console.WriteLine("==> Dev moderator seeded: mod@fexora.io / Mod123!");
    }
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

// Map endpoints
app.MapControllers();
app.MapHub<Fexora.Api.Hubs.ChatHub>("/hubs/chat");
app.MapHealthChecks("/health");

app.MapGet("/", () => new { Name = "Fexora API", Version = "0.1.0" });

await app.RunAsync();
