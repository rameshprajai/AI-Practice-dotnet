using SecureBank.Api.Exceptions;
using SecureBank.Api.Models;
using SecureBank.Api.Repositories;

namespace SecureBank.Api.Services;

public class TransferService : ITransferService
{
    private readonly ITransferRepository _transferRepository;

    public TransferService(ITransferRepository transferRepository)
    {
        _transferRepository = transferRepository;
    }

    public async Task<List<AccountSummary>> GetAccountsForUserAsync(string userEmail, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(userEmail))
        {
            throw new TransferAuthorizationException("Authenticated user is required.", "UNAUTHORIZED");
        }

        return await _transferRepository.GetAccountsByUserEmailAsync(userEmail, cancellationToken);
    }

    public async Task<List<RecipientSummary>> GetRecipientsForUserAsync(string userEmail, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(userEmail))
        {
            throw new TransferAuthorizationException("Authenticated user is required.", "UNAUTHORIZED");
        }

        return await _transferRepository.GetRecipientsByUserEmailAsync(userEmail, cancellationToken);
    }

    public async Task<TransferResponse> ProcessTransferAsync(string userEmail, TransferRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(userEmail))
        {
            throw new TransferAuthorizationException("Authenticated user is required.", "UNAUTHORIZED");
        }

        if (request is null)
        {
            throw new TransferValidationException("Transfer request is required.", "VALIDATION_ERROR");
        }

        if (string.IsNullOrWhiteSpace(request.FromAccountId))
        {
            throw new TransferValidationException("Source account is required.", "VALIDATION_ERROR");
        }

        if (string.IsNullOrWhiteSpace(request.ToAccountId))
        {
            throw new TransferValidationException("Recipient account is required.", "VALIDATION_ERROR");
        }

        if (request.Amount <= 0)
        {
            throw new TransferValidationException("Transfer amount must be greater than zero.", "INVALID_AMOUNT");
        }

        var userAccounts = await _transferRepository.GetAccountsByUserEmailAsync(userEmail, cancellationToken);
        var selectedAccount = userAccounts.FirstOrDefault(account => account.Id.Equals(request.FromAccountId, StringComparison.OrdinalIgnoreCase));

        if (selectedAccount is null)
        {
            throw new TransferValidationException("The selected source account is not available for this user.", "INVALID_ACCOUNT");
        }

        if (!selectedAccount.IsActive)
        {
            throw new TransferValidationException("The selected source account is not active.", "INVALID_ACCOUNT");
        }

        var validRecipients = await _transferRepository.GetRecipientsByUserEmailAsync(userEmail, cancellationToken);
        var recipientExists = validRecipients.Any(recipient => recipient.AccountId.Equals(request.ToAccountId, StringComparison.OrdinalIgnoreCase)
            || recipient.Id.Equals(request.ToAccountId, StringComparison.OrdinalIgnoreCase));

        if (!recipientExists)
        {
            throw new TransferValidationException("The selected recipient is invalid or unavailable.", "INVALID_RECIPIENT");
        }

        if (request.Amount > selectedAccount.Balance)
        {
            throw new TransferValidationException("The selected account does not have enough available funds for this transfer.", "INSUFFICIENT_FUNDS");
        }

        selectedAccount.Balance -= request.Amount;

        var transfer = new TransferRecord
        {
            Id = $"TRF-{Guid.NewGuid():N}".ToUpperInvariant(),
            FromAccountId = selectedAccount.Id,
            ToAccountId = request.ToAccountId,
            Amount = request.Amount,
            Currency = string.IsNullOrWhiteSpace(request.Currency) ? "USD" : request.Currency,
            Status = "completed",
            CreatedAtUtc = DateTime.UtcNow
        };

        await _transferRepository.AddTransferAsync(transfer, cancellationToken);

        return new TransferResponse
        {
            Success = true,
            Message = "Transfer processed successfully",
            Transfer = transfer
        };
    }
}
