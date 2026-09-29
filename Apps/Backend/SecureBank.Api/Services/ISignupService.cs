using SecureBank.Api.Models;

namespace SecureBank.Api.Services;

public interface ISignupService
{
    Task<UserAccount> CreateAccountAsync(SignupRequest request, CancellationToken cancellationToken = default);
}
