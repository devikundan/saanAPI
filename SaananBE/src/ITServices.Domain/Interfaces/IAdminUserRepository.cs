using ITServices.Domain.Entities;

namespace ITServices.Domain.Interfaces;

public interface IAdminUserRepository : IGenericRepository<AdminUser>
{
    Task<AdminUser?> GetByEmailAsync(string email);
}
