using ITServices.Domain.Entities;

namespace ITServices.Domain.Interfaces;

public interface IPortfolioRepository : IGenericRepository<PortfolioProject>
{
    Task<PortfolioProject?> GetBySlugAsync(string slug);
    Task<IEnumerable<PortfolioProject>> GetActiveProjectsAsync();
}
