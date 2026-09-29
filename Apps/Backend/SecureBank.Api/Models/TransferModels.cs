namespace SecureBank.Api.Models;

public class TransferRequest
{
    public string FromAccountId { get; set; } = string.Empty;
    public string ToAccountId { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "USD";
    public string Memo { get; set; } = string.Empty;
}

public class TransferResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public TransferRecord Transfer { get; set; } = new();
}

public class TransferRecord
{
    public string Id { get; set; } = string.Empty;
    public string FromAccountId { get; set; } = string.Empty;
    public string ToAccountId { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "USD";
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; }
}

public class AccountSummary
{
    public string Id { get; set; } = string.Empty;
    public string UserEmail { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public decimal Balance { get; set; }
    public string Currency { get; set; } = "USD";
    public bool IsActive { get; set; } = true;
}

public class RecipientSummary
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Nickname { get; set; } = string.Empty;
    public string AccountId { get; set; } = string.Empty;
    public string UserEmail { get; set; } = string.Empty;
}
