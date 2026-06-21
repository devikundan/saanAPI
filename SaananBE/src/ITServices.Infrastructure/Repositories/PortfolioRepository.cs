using ITServices.Domain.Entities;
using ITServices.Domain.Interfaces;
using ITServices.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ITServices.Infrastructure.Repositories;

public class PortfolioRepository : GenericRepository<PortfolioProject>, IPortfolioRepository
{
    public PortfolioRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<PortfolioProject?> GetBySlugAsync(string slug)
    {
        return await _dbSet.AsNoTracking()
            .FirstOrDefaultAsync(x => x.Slug == slug && x.IsActive);
    }

    public async Task<IEnumerable<PortfolioProject>> GetActiveProjectsAsync()
    {
        return await _dbSet.AsNoTracking()
            .Where(x => x.IsActive)
            .OrderBy(x => x.DisplayOrder)
            .ToListAsync();
    }
}
