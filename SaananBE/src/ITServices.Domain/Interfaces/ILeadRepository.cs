using ITServices.Domain.Entities;

namespace ITServices.Domain.Interfaces;

public interface ILeadRepository : IGenericRepository<Lead>
{
    Task<Lead?> GetByIdWithServiceAsync(Guid id);
}
