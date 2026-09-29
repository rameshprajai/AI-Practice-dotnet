using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using SecureBank.Api.Exceptions;
using SecureBank.Api.Models;
using SecureBank.Api.Services;

namespace SecureBank.Api.Controllers;

[ApiController]
[Route("api/v1/auth")]
public class AuthController : ControllerBase
{
    private readonly ISignupService _signupService;
    private readonly ISigninService _signinService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(ISignupService signupService, ISigninService signinService, ILogger<AuthController> logger)
    {
        _signupService = signupService;
        _signinService = signinService;
        _logger = logger;
    }

    [HttpPost("signup")]
    [ProducesResponseType(typeof(SignupResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Signup([FromBody] SignupRequest request, CancellationToken cancellationToken)
    {
        if (request is null)
        {
            throw new SignupValidationException("Request body is required.", "VALIDATION_ERROR");
        }

        _logger.LogInformation("Signup request received for email: {Email}", request.Email);

        if (!ModelState.IsValid)
        {
            var validationErrors = ModelState
                .Values
                .SelectMany(state => state.Errors)
                .Select(error => error.ErrorMessage)
                .Where(message => !string.IsNullOrWhiteSpace(message))
                .Distinct()
                .ToList();

            var message = validationErrors.Count > 0
                ? string.Join("; ", validationErrors)
                : "Please correct the highlighted fields and try again.";

            throw new SignupValidationException(message, "VALIDATION_ERROR");
        }

        var createdUser = await _signupService.CreateAccountAsync(request, cancellationToken);

        var response = new SignupResponse
        {
            Success = true,
            Message = "Account created successfully",
            User = new UserResponse
            {
                Id = createdUser.Id,
                FullName = createdUser.FullName,
                Email = createdUser.Email
            }
        };

        return StatusCode(StatusCodes.Status201Created, response);
    }

    [HttpPost("signin")]
    [ProducesResponseType(typeof(SigninResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Signin([FromBody] SigninRequest request, CancellationToken cancellationToken)
    {
        if (request is null)
        {
            throw new SigninValidationException("Request body is required.", "VALIDATION_ERROR");
        }

        _logger.LogInformation("Signin request received for email: {Email}", request.Email);

        if (!ModelState.IsValid)
        {
            var validationErrors = ModelState
                .Values
                .SelectMany(state => state.Errors)
                .Select(error => error.ErrorMessage)
                .Where(message => !string.IsNullOrWhiteSpace(message))
                .Distinct()
                .ToList();

            var message = validationErrors.Count > 0
                ? string.Join("; ", validationErrors)
                : "Please correct the highlighted fields and try again.";

            throw new SigninValidationException(message, "VALIDATION_ERROR");
        }

        var authenticatedUser = await _signinService.SignInAsync(request, cancellationToken);

        var response = new SigninResponse
        {
            Success = true,
            Message = "Sign in successful",
            User = new UserResponse
            {
                Id = authenticatedUser.Id,
                FullName = authenticatedUser.FullName,
                Email = authenticatedUser.Email
            }
        };

        return Ok(response);
    }
}

public class SignupResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public UserResponse User { get; set; } = new();
}

public class SigninResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public UserResponse User { get; set; } = new();
}

public class UserResponse
{
    public string Id { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}

public class ApiErrorResponse
{
    public bool Success { get; set; }
    public ErrorDetails Error { get; set; } = new();
}

public class ErrorDetails
{
    public string Code { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}
