using ITServices.Domain.Entities;
using ITServices.Domain.Interfaces;
using ITServices.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ITServices.Infrastructure.Repositories;

public class QueryClassificationRepository : GenericRepository<QueryClassification>, IQueryClassificationRepository
{
    public QueryClassificationRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<QueryClassification>> GetByLeadIdAsync(Guid leadId)
    {
        return await _dbSet.AsNoTracking()
            .Where(x => x.LeadId == leadId)
            .OrderByDescending(x => x.ClassifiedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<QueryClassification>> GetRecentClassificationsAsync(int count)
    {
        return await _dbSet.AsNoTracking()
            .OrderByDescending(x => x.ClassifiedAt)
            .Take(count)
            .ToListAsync();
    }
}
