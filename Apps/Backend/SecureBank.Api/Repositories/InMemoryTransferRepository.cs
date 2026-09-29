using SecureBank.Api.Models;

namespace SecureBank.Api.Repositories;

public class InMemoryTransferRepository : ITransferRepository
{
    private static readonly Dictionary<string, List<AccountSummary>> AccountsByEmail = new(StringComparer.OrdinalIgnoreCase);
    private static readonly Dictionary<string, List<RecipientSummary>> RecipientsByEmail = new(StringComparer.OrdinalIgnoreCase);
    private static readonly List<TransferRecord> Transfers = new();

    public Task<List<AccountSummary>> GetAccountsByUserEmailAsync(string userEmail, CancellationToken cancellationToken = default)
    {
        EnsureUserData(userEmail);
        return Task.FromResult(AccountsByEmail[userEmail]);
    }

    public Task<List<RecipientSummary>> GetRecipientsByUserEmailAsync(string userEmail, CancellationToken cancellationToken = default)
    {
        EnsureUserData(userEmail);
        return Task.FromResult(RecipientsByEmail[userEmail]);
    }

    public Task<TransferRecord> AddTransferAsync(TransferRecord record, CancellationToken cancellationToken = default)
    {
        Transfers.Add(record);
        return Task.FromResult(record);
    }

    public Task<TransferRecord?> GetTransferByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        return Task.FromResult(Transfers.FirstOrDefault(transfer => transfer.Id.Equals(id, StringComparison.OrdinalIgnoreCase)));
    }

    private static void EnsureUserData(string userEmail)
    {
        if (string.IsNullOrWhiteSpace(userEmail))
        {
            return;
        }

        if (!AccountsByEmail.ContainsKey(userEmail))
        {
            AccountsByEmail[userEmail] = new List<AccountSummary>
            {
                new() { Id = "ACC-1001", UserEmail = userEmail, Type = "Checking", Balance = 2450.75m, Currency = "USD", IsActive = true },
                new() { Id = "ACC-2004", UserEmail = userEmail, Type = "Savings", Balance = 4200.00m, Currency = "USD", IsActive = true }
            };
        }

        if (!RecipientsByEmail.ContainsKey(userEmail))
        {
            RecipientsByEmail[userEmail] = new List<RecipientSummary>
            {
                new() { Id = "BEN-1001", Name = "Alicia Hart", Nickname = "Family Savings", AccountId = "ACC-3001", UserEmail = userEmail },
                new() { Id = "BEN-1002", Name = "Marcus Lee", Nickname = "Rent", AccountId = "ACC-3002", UserEmail = userEmail }
            };
        }
    }
}
