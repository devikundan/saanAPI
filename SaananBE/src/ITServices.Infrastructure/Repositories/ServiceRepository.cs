using ITServices.Domain.Entities;
using ITServices.Domain.Interfaces;
using ITServices.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ITServices.Infrastructure.Repositories;

public class ServiceRepository : GenericRepository<Service>, IServiceRepository
{
    public ServiceRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Service?> GetBySlugAsync(string slug)
    {
        return await _dbSet.AsNoTracking()
            .Include(x => x.ServiceCategory)
            .FirstOrDefaultAsync(x => x.Slug == slug && x.IsActive);
    }

    public async Task<IEnumerable<Service>> GetActiveServicesAsync()
    {
        return await _dbSet.AsNoTracking()
            .Include(x => x.ServiceCategory)
            .Where(x => x.IsActive)
            .OrderBy(x => x.DisplayOrder)
            .ToListAsync();
    }

    public async Task<IEnumerable<Service>> GetActiveServicesByCategoryAsync(Guid categoryId)
    {
        return await _dbSet.AsNoTracking()
            .Include(x => x.ServiceCategory)
            .Where(x => x.IsActive && x.ServiceCategoryId == categoryId)
            .OrderBy(x => x.DisplayOrder)
            .ToListAsync();
    }

    public async Task<Service?> GetByIdWithCategoryAsync(Guid id)
    {
        return await _dbSet
            .Include(x => x.ServiceCategory)
            .FirstOrDefaultAsync(x => x.Id == id);
    }
}
