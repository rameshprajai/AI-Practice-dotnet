using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;

namespace SecureBank.Api.Tests;

public class TransferEndpointTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public TransferEndpointTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task GetAccounts_WithValidHeader_ReturnsUserAccounts()
    {
        var client = _factory.CreateClient();
        var email = $"transfer.accounts.{Guid.NewGuid():N}@example.com";

        await client.PostAsJsonAsync("/api/v1/auth/signup", new
        {
            fullName = "Transfer User",
            email,
            password = "SecurePass!123",
            confirmPassword = "SecurePass!123"
        });

        client.DefaultRequestHeaders.Remove("X-User-Email");
        client.DefaultRequestHeaders.Add("X-User-Email", email);

        var response = await client.GetAsync("/api/v1/accounts");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var payload = await response.Content.ReadFromJsonAsync<AccountListResponse>();
        Assert.NotNull(payload);
        Assert.True(payload!.Success);
        Assert.NotEmpty(payload.Accounts);
    }

    [Fact]
    public async Task GetRecipients_WithValidHeader_ReturnsAvailableRecipients()
    {
        var client = _factory.CreateClient();
        var email = $"transfer.recipients.{Guid.NewGuid():N}@example.com";

        await client.PostAsJsonAsync("/api/v1/auth/signup", new
        {
            fullName = "Recipient User",
            email,
            password = "SecurePass!123",
            confirmPassword = "SecurePass!123"
        });

        client.DefaultRequestHeaders.Remove("X-User-Email");
        client.DefaultRequestHeaders.Add("X-User-Email", email);

        var response = await client.GetAsync("/api/v1/recipients");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var payload = await response.Content.ReadFromJsonAsync<RecipientListResponse>();
        Assert.NotNull(payload);
        Assert.True(payload!.Success);
        Assert.NotEmpty(payload.Recipients);
    }

    [Fact]
    public async Task PostTransfer_WithSufficientFunds_ReturnsCreated()
    {
        var client = _factory.CreateClient();
        var email = $"transfer.submit.{Guid.NewGuid():N}@example.com";

        await client.PostAsJsonAsync("/api/v1/auth/signup", new
        {
            fullName = "Transfer Submitter",
            email,
            password = "SecurePass!123",
            confirmPassword = "SecurePass!123"
        });

        client.DefaultRequestHeaders.Remove("X-User-Email");
        client.DefaultRequestHeaders.Add("X-User-Email", email);

        var transferRequest = new
        {
            fromAccountId = "ACC-1001",
            toAccountId = "BEN-1001",
            amount = 50.00m,
            currency = "USD",
            memo = "Monthly transfer"
        };

        var response = await client.PostAsJsonAsync("/api/v1/transfers", transferRequest);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var payload = await response.Content.ReadFromJsonAsync<TransferSuccessResponse>();
        Assert.NotNull(payload);
        Assert.True(payload!.Success);
        Assert.Equal("completed", payload.Transfer.Status);
    }

    [Fact]
    public async Task PostTransfer_WithInsufficientFunds_ReturnsBadRequest()
    {
        var client = _factory.CreateClient();
        var email = $"transfer.insufficient.{Guid.NewGuid():N}@example.com";

        await client.PostAsJsonAsync("/api/v1/auth/signup", new
        {
            fullName = "Transfer Limits",
            email,
            password = "SecurePass!123",
            confirmPassword = "SecurePass!123"
        });

        client.DefaultRequestHeaders.Remove("X-User-Email");
        client.DefaultRequestHeaders.Add("X-User-Email", email);

        var transferRequest = new
        {
            fromAccountId = "ACC-1001",
            toAccountId = "BEN-1001",
            amount = 15000.00m,
            currency = "USD",
            memo = "Too large"
        };

        var response = await client.PostAsJsonAsync("/api/v1/transfers", transferRequest);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    private sealed class AccountListResponse
    {
        public bool Success { get; set; }
        public List<AccountDto> Accounts { get; set; } = new();
    }

    private sealed class AccountDto
    {
        public string Id { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public decimal Balance { get; set; }
        public string Currency { get; set; } = string.Empty;
    }

    private sealed class RecipientListResponse
    {
        public bool Success { get; set; }
        public List<RecipientDto> Recipients { get; set; } = new();
    }

    private sealed class RecipientDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Nickname { get; set; } = string.Empty;
    }

    private sealed class TransferSuccessResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public TransferDto Transfer { get; set; } = new();
    }

    private sealed class TransferDto
    {
        public string Id { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }
}
