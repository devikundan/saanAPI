using ITServices.Domain.Entities;

namespace ITServices.Domain.Interfaces;

public interface IContentRepository : IGenericRepository<Content>
{
    Task<Content?> GetBySectionKeyAsync(string sectionKey);
    Task<IEnumerable<Content>> GetAllSectionsAsync();
}
