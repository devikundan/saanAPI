using ITServices.Domain.Entities;

namespace ITServices.Domain.Interfaces;

public interface IFaqRepository : IGenericRepository<Faq>
{
    Task<IEnumerable<Faq>> GetActiveFaqsAsync();
}
