using ITServices.Domain.Entities;

namespace ITServices.Domain.Interfaces;

public interface IServiceCategoryRepository : IGenericRepository<ServiceCategory>
{
    Task<ServiceCategory?> GetBySlugAsync(string slug);
    Task<IEnumerable<ServiceCategory>> GetActiveCategoriesAsync();
    Task<IEnumerable<ServiceCategory>> GetActiveCategoriesWithServicesAsync();
}
