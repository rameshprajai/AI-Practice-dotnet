using SecureBank.Api.Models;

namespace SecureBank.Api.Services;

public interface ITransferService
{
    Task<List<AccountSummary>> GetAccountsForUserAsync(string userEmail, CancellationToken cancellationToken = default);
    Task<List<RecipientSummary>> GetRecipientsForUserAsync(string userEmail, CancellationToken cancellationToken = default);
    Task<TransferResponse> ProcessTransferAsync(string userEmail, TransferRequest request, CancellationToken cancellationToken = default);
}
