using ITServices.Domain.Entities;
using ITServices.Domain.Interfaces;
using ITServices.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ITServices.Infrastructure.Repositories;

public class ServiceCategoryRepository : GenericRepository<ServiceCategory>, IServiceCategoryRepository
{
    public ServiceCategoryRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<ServiceCategory?> GetBySlugAsync(string slug)
    {
        return await _dbSet.AsNoTracking()
            .FirstOrDefaultAsync(x => x.Slug == slug);
    }

    public async Task<IEnumerable<ServiceCategory>> GetActiveCategoriesAsync()
    {
        return await _dbSet.AsNoTracking()
            .Where(x => x.IsActive)
            .OrderBy(x => x.DisplayOrder)
            .ToListAsync();
    }

    public async Task<IEnumerable<ServiceCategory>> GetActiveCategoriesWithServicesAsync()
    {
        return await _dbSet.AsNoTracking()
            .Include(x => x.Services.Where(s => s.IsActive).OrderBy(s => s.DisplayOrder))
            .Where(x => x.IsActive)
            .OrderBy(x => x.DisplayOrder)
            .ToListAsync();
    }
}
