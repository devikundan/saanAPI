using ITServices.Domain.Entities;

namespace ITServices.Domain.Interfaces;

public interface IProposalSummaryRepository : IGenericRepository<ProposalSummary>
{
    Task<ProposalSummary?> GetByLeadIdAsync(Guid leadId);
    Task<IEnumerable<ProposalSummary>> GetRecentProposalsAsync(int count);
}
