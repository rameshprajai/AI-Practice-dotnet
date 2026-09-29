using Microsoft.AspNetCore.Mvc;
using SecureBank.Api.Exceptions;
using SecureBank.Api.Models;
using SecureBank.Api.Services;

namespace SecureBank.Api.Controllers;

[ApiController]
[Route("api/v1")]
public class TransferController : ControllerBase
{
    private readonly ITransferService _transferService;
    private readonly ILogger<TransferController> _logger;

    public TransferController(ITransferService transferService, ILogger<TransferController> logger)
    {
        _transferService = transferService;
        _logger = logger;
    }

    [HttpGet("accounts")]
    [ProducesResponseType(typeof(AccountListResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetAccounts(CancellationToken cancellationToken)
    {
        var userEmail = Request.Headers["X-User-Email"].FirstOrDefault();

        if (string.IsNullOrWhiteSpace(userEmail))
        {
            throw new TransferAuthorizationException("Authenticated user is required.", "UNAUTHORIZED");
        }

        var accounts = await _transferService.GetAccountsForUserAsync(userEmail, cancellationToken);

        return Ok(new AccountListResponse
        {
            Success = true,
            Accounts = accounts.Select(account => new AccountDto
            {
                Id = account.Id,
                Type = account.Type,
                Balance = account.Balance,
                Currency = account.Currency,
                Status = account.IsActive ? "active" : "inactive"
            }).ToList()
        });
    }

    [HttpGet("recipients")]
    [ProducesResponseType(typeof(RecipientListResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetRecipients(CancellationToken cancellationToken)
    {
        var userEmail = Request.Headers["X-User-Email"].FirstOrDefault();

        if (string.IsNullOrWhiteSpace(userEmail))
        {
            throw new TransferAuthorizationException("Authenticated user is required.", "UNAUTHORIZED");
        }

        var recipients = await _transferService.GetRecipientsForUserAsync(userEmail, cancellationToken);

        return Ok(new RecipientListResponse
        {
            Success = true,
            Recipients = recipients.Select(recipient => new RecipientDto
            {
                Id = recipient.Id,
                Name = recipient.Name,
                Nickname = recipient.Nickname,
                AccountId = recipient.AccountId
            }).ToList()
        });
    }

    [HttpPost("transfers")]
    [ProducesResponseType(typeof(TransferResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> CreateTransfer([FromBody] TransferRequest request, CancellationToken cancellationToken)
    {
        var userEmail = Request.Headers["X-User-Email"].FirstOrDefault();

        if (string.IsNullOrWhiteSpace(userEmail))
        {
            throw new TransferAuthorizationException("Authenticated user is required.", "UNAUTHORIZED");
        }

        if (request is null)
        {
            throw new TransferValidationException("Transfer request is required.", "VALIDATION_ERROR");
        }

        _logger.LogInformation("Transfer request received for user {UserEmail} from account {FromAccountId}", userEmail, request.FromAccountId);

        var result = await _transferService.ProcessTransferAsync(userEmail, request, cancellationToken);

        return StatusCode(StatusCodes.Status201Created, result);
    }
}

public class AccountListResponse
{
    public bool Success { get; set; }
    public List<AccountDto> Accounts { get; set; } = new();
}

public class AccountDto
{
    public string Id { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public decimal Balance { get; set; }
    public string Currency { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}

public class RecipientListResponse
{
    public bool Success { get; set; }
    public List<RecipientDto> Recipients { get; set; } = new();
}

public class RecipientDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Nickname { get; set; } = string.Empty;
    public string AccountId { get; set; } = string.Empty;
}
