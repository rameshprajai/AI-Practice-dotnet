using SecureBank.Api.Models;

namespace SecureBank.Api.Repositories;

public interface ITransferRepository
{
    Task<List<AccountSummary>> GetAccountsByUserEmailAsync(string userEmail, CancellationToken cancellationToken = default);
    Task<List<RecipientSummary>> GetRecipientsByUserEmailAsync(string userEmail, CancellationToken cancellationToken = default);
    Task<TransferRecord> AddTransferAsync(TransferRecord record, CancellationToken cancellationToken = default);
    Task<TransferRecord?> GetTransferByIdAsync(string id, CancellationToken cancellationToken = default);
}
