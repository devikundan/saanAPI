using ITServices.Domain.Entities;

namespace ITServices.Domain.Interfaces;

public interface IQueryClassificationRepository : IGenericRepository<QueryClassification>
{
    Task<IEnumerable<QueryClassification>> GetByLeadIdAsync(Guid leadId);
    Task<IEnumerable<QueryClassification>> GetRecentClassificationsAsync(int count);
}
