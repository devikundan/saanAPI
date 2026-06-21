using ITServices.Domain.Entities;
using ITServices.Domain.Interfaces;
using ITServices.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ITServices.Infrastructure.Repositories;

public class ProposalSummaryRepository : GenericRepository<ProposalSummary>, IProposalSummaryRepository
{
    public ProposalSummaryRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<ProposalSummary?> GetByLeadIdAsync(Guid leadId)
    {
        return await _dbSet.AsNoTracking()
            .Include(x => x.Lead)
            .FirstOrDefaultAsync(x => x.LeadId == leadId);
    }

    public async Task<IEnumerable<ProposalSummary>> GetRecentProposalsAsync(int count)
    {
        return await _dbSet.AsNoTracking()
            .Include(x => x.Lead)
            .OrderByDescending(x => x.GeneratedAt)
            .Take(count)
            .ToListAsync();
    }
}
