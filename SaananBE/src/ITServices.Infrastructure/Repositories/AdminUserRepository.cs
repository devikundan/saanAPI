using ITServices.Domain.Entities;
using ITServices.Domain.Interfaces;
using ITServices.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ITServices.Infrastructure.Repositories;

public class AdminUserRepository : GenericRepository<AdminUser>, IAdminUserRepository
{
    public AdminUserRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<AdminUser?> GetByEmailAsync(string email)
    {
        return await _dbSet.FirstOrDefaultAsync(x => x.Email == email);
    }
}
