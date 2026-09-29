using SecureBank.Api.Models;

namespace SecureBank.Api.Repositories;

public interface IUserRepository
{
    Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken = default);
    Task<UserAccount?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<UserAccount> AddAsync(UserAccount userAccount, CancellationToken cancellationToken = default);
}
