using ITServices.Domain.Entities;
using ITServices.Domain.Interfaces;
using ITServices.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ITServices.Infrastructure.Repositories;

public class FaqRepository : GenericRepository<Faq>, IFaqRepository
{
    public FaqRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Faq>> GetActiveFaqsAsync()
    {
        return await _dbSet.AsNoTracking()
            .Where(x => x.IsActive)
            .OrderBy(x => x.DisplayOrder)
            .ToListAsync();
    }
}
