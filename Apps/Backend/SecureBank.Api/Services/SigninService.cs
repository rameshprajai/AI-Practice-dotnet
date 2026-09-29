using SecureBank.Api.Exceptions;
using SecureBank.Api.Models;
using SecureBank.Api.Repositories;

namespace SecureBank.Api.Services;

public class SigninService : ISigninService
{
    private readonly IUserRepository _userRepository;

    public SigninService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<UserAccount> SignInAsync(SigninRequest request, CancellationToken cancellationToken = default)
    {
        if (request is null)
        {
            throw new SigninValidationException("Signin request is required.", "VALIDATION_ERROR");
        }

        if (string.IsNullOrWhiteSpace(request.Email) || !IsValidEmail(request.Email))
        {
            throw new SigninValidationException("A valid email address is required.", "VALIDATION_ERROR");
        }

        if (string.IsNullOrWhiteSpace(request.Password))
        {
            throw new SigninValidationException("Password is required.", "VALIDATION_ERROR");
        }

        var storedUser = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);

        if (storedUser is null)
        {
            throw new SigninAuthenticationException("The email or password you entered is incorrect.", "INVALID_CREDENTIALS");
        }

        var submittedPassword = request.Password.Trim();
        var storedPassword = storedUser.PasswordHash;

        if (!string.Equals(storedPassword, Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(submittedPassword)), StringComparison.Ordinal))
        {
            throw new SigninAuthenticationException("The email or password you entered is incorrect.", "INVALID_CREDENTIALS");
        }

        return storedUser;
    }

    private static bool IsValidEmail(string email)
    {
        return email.Contains('@') && email.Contains('.') && !email.StartsWith('@') && !email.EndsWith('.');
    }
}
