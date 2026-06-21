using ITServices.Domain.Entities;
using ITServices.Domain.Interfaces;
using ITServices.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ITServices.Infrastructure.Repositories;

public class ContentRepository : GenericRepository<Content>, IContentRepository
{
    public ContentRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Content?> GetBySectionKeyAsync(string sectionKey)
    {
        return await _dbSet.AsNoTracking()
            .FirstOrDefaultAsync(x => x.SectionKey == sectionKey);
    }

    public async Task<IEnumerable<Content>> GetAllSectionsAsync()
    {
        return await _dbSet.AsNoTracking()
            .OrderBy(x => x.SectionKey)
            .ToListAsync();
    }
}
