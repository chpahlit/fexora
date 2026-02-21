namespace Fexora.Core.DTOs.Gdpr;

public class ConsentRequest
{
    public bool ConsentPrivacyPolicy { get; set; }
    public bool ConsentTermsOfService { get; set; }
}

public class DataExportResponse
{
    public UserExportData User { get; set; } = null!;
    public ProfileExportData? Profile { get; set; }
    public List<ContentExportData> Content { get; set; } = [];
    public List<TransactionExportData> Transactions { get; set; } = [];
    public List<MessageExportData> Messages { get; set; } = [];
    public List<PurchaseExportData> Purchases { get; set; } = [];
}

public class UserExportData
{
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public bool IsVerified18 { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class ProfileExportData
{
    public string Username { get; set; } = string.Empty;
    public int? Age { get; set; }
    public string? Country { get; set; }
    public string? Bio { get; set; }
}

public class ContentExportData
{
    public string Title { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public int PriceCredits { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class TransactionExportData
{
    public string Type { get; set; } = string.Empty;
    public int Amount { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class MessageExportData
{
    public string Body { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class PurchaseExportData
{
    public string ContentTitle { get; set; } = string.Empty;
    public int PriceCredits { get; set; }
    public DateTime CreatedAt { get; set; }
}
