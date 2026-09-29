using SecureBank.Api.Models;

namespace SecureBank.Api.Services;

public interface ISigninService
{
    Task<UserAccount> SignInAsync(SigninRequest request, CancellationToken cancellationToken = default);
}
