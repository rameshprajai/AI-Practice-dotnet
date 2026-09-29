using SecureBank.Api.Exceptions;
using SecureBank.Api.Models;
using SecureBank.Api.Repositories;

namespace SecureBank.Api.Services;

public class SignupService : ISignupService
{
    private readonly IUserRepository _userRepository;

    public SignupService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<UserAccount> CreateAccountAsync(SignupRequest request, CancellationToken cancellationToken = default)
    {
        if (request is null)
        {
            throw new SignupValidationException("Signup request is required.", "VALIDATION_ERROR");
        }

        if (string.IsNullOrWhiteSpace(request.FullName))
        {
            throw new SignupValidationException("Full name is required.", "VALIDATION_ERROR");
        }

        if (string.IsNullOrWhiteSpace(request.Email) || !IsValidEmail(request.Email))
        {
            throw new SignupValidationException("A valid email address is required.", "VALIDATION_ERROR");
        }

        if (string.IsNullOrWhiteSpace(request.Password))
        {
            throw new SignupValidationException("Password is required.", "VALIDATION_ERROR");
        }

        if (request.Password.Length < 8)
        {
            throw new SignupValidationException("Password must be at least 8 characters long.", "PASSWORD_POLICY_VIOLATION");
        }

        if (string.IsNullOrWhiteSpace(request.ConfirmPassword) || !string.Equals(request.Password, request.ConfirmPassword, StringComparison.Ordinal))
        {
            throw new SignupValidationException("Passwords do not match.", "VALIDATION_ERROR");
        }

        if (await _userRepository.EmailExistsAsync(request.Email, cancellationToken))
        {
            throw new SignupConflictException("An account with this email already exists.", "EMAIL_ALREADY_EXISTS");
        }

        var user = new UserAccount
        {
            Id = Guid.NewGuid().ToString("N"),
            FullName = request.FullName.Trim(),
            Email = request.Email.Trim(),
            PasswordHash = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(request.Password)),
            CreatedAtUtc = DateTime.UtcNow
        };

        return await _userRepository.AddAsync(user, cancellationToken);
    }

    private static bool IsValidEmail(string email)
    {
        return email.Contains('@') && email.Contains('.') && !email.StartsWith('@') && !email.EndsWith('.');
    }
}
