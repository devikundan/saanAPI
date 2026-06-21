using ITServices.Domain.Entities;

namespace ITServices.Domain.Interfaces;

public interface IBlogRepository : IGenericRepository<Blog>
{
    Task<Blog?> GetBySlugAsync(string slug);
    Task<(IEnumerable<Blog> Items, int TotalCount)> GetPublishedBlogsAsync(int page, int pageSize);
}
