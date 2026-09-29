using SecureBank.Api.Models;

namespace SecureBank.Api.Repositories;

public class InMemoryUserRepository : IUserRepository
{
    private static readonly List<UserAccount> Users = new();

    public Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken = default)
    {
        var normalizedEmail = email.Trim();
        return Task.FromResult(Users.Any(user => user.Email.Equals(normalizedEmail, StringComparison.OrdinalIgnoreCase)));
    }

    public Task<UserAccount?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        var normalizedEmail = email.Trim();
        var user = Users.FirstOrDefault(user => user.Email.Equals(normalizedEmail, StringComparison.OrdinalIgnoreCase));
        return Task.FromResult(user);
    }

    public Task<UserAccount> AddAsync(UserAccount userAccount, CancellationToken cancellationToken = default)
    {
        Users.Add(userAccount);
        return Task.FromResult(userAccount);
    }
}
