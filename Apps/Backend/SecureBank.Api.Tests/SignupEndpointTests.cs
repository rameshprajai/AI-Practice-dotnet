using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;

namespace SecureBank.Api.Tests;

public class SignupEndpointTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public SignupEndpointTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task PostSignup_WithValidPayload_ReturnsCreated()
    {
        var client = _factory.CreateClient();
        var request = new
        {
            fullName = "Jane Doe",
            email = "jane.doe@example.com",
            password = "SecurePass!123",
            confirmPassword = "SecurePass!123"
        };

        var response = await client.PostAsJsonAsync("/api/v1/auth/signup", request);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var payload = await response.Content.ReadFromJsonAsync<SignupSuccessResponse>();
        Assert.NotNull(payload);
        Assert.True(payload!.Success);
        Assert.Equal("Jane Doe", payload.User.FullName);
        Assert.Equal("jane.doe@example.com", payload.User.Email);
    }

    [Fact]
    public async Task PostSignup_WithMissingFullName_ReturnsBadRequest()
    {
        var client = _factory.CreateClient();
        var request = new
        {
            fullName = "",
            email = "jane.doe@example.com",
            password = "SecurePass!123",
            confirmPassword = "SecurePass!123"
        };

        var response = await client.PostAsJsonAsync("/api/v1/auth/signup", request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task PostSignup_WithPasswordMismatch_ReturnsBadRequest()
    {
        var client = _factory.CreateClient();
        var request = new
        {
            fullName = "Jane Doe",
            email = "jane.doe@example.com",
            password = "SecurePass!123",
            confirmPassword = "DifferentPass!123"
        };

        var response = await client.PostAsJsonAsync("/api/v1/auth/signup", request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task PostSignup_WithDuplicateEmail_ReturnsConflict()
    {
        var client = _factory.CreateClient();
        var request = new
        {
            fullName = "Jane Doe",
            email = "duplicate@example.com",
            password = "SecurePass!123",
            confirmPassword = "SecurePass!123"
        };

        await client.PostAsJsonAsync("/api/v1/auth/signup", request);
        var secondResponse = await client.PostAsJsonAsync("/api/v1/auth/signup", request);

        Assert.Equal(HttpStatusCode.Conflict, secondResponse.StatusCode);
    }

    [Fact]
    public async Task PostSignin_WithValidCredentials_ReturnsOk()
    {
        var client = _factory.CreateClient();

        await client.PostAsJsonAsync("/api/v1/auth/signup", new
        {
            fullName = "Jane Doe",
            email = "jane.doe@example.com",
            password = "SecurePass!123",
            confirmPassword = "SecurePass!123"
        });

        var response = await client.PostAsJsonAsync("/api/v1/auth/signin", new
        {
            email = "jane.doe@example.com",
            password = "SecurePass!123"
        });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var payload = await response.Content.ReadFromJsonAsync<SigninSuccessResponse>();
        Assert.NotNull(payload);
        Assert.True(payload!.Success);
        Assert.Equal("Jane Doe", payload.User.FullName);
        Assert.Equal("jane.doe@example.com", payload.User.Email);
    }

    [Fact]
    public async Task PostSignin_WithMissingPassword_ReturnsBadRequest()
    {
        var client = _factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/v1/auth/signin", new
        {
            email = "jane.doe@example.com",
            password = ""
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task PostSignin_WithInvalidCredentials_ReturnsUnauthorized()
    {
        var client = _factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/v1/auth/signin", new
        {
            email = "unknown@example.com",
            password = "WrongPass!123"
        });

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    private sealed class SignupSuccessResponse
    {
        public bool Success { get; set; }
        public UserDto User { get; set; } = new();
    }

    private sealed class SigninSuccessResponse
    {
        public bool Success { get; set; }
        public UserDto User { get; set; } = new();
    }

    private sealed class UserDto
    {
        public string Id { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}
