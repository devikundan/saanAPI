using ITServices.Domain.Entities;

namespace ITServices.Domain.Interfaces;

public interface IServiceRepository : IGenericRepository<Service>
{
    Task<Service?> GetBySlugAsync(string slug);
    Task<IEnumerable<Service>> GetActiveServicesAsync();
    Task<IEnumerable<Service>> GetActiveServicesByCategoryAsync(Guid categoryId);
    Task<Service?> GetByIdWithCategoryAsync(Guid id);
}
