using ITServices.Domain.Entities;
using ITServices.Domain.Enums;
using ITServices.Domain.Interfaces;
using ITServices.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ITServices.Infrastructure.Repositories;

public class BlogRepository : GenericRepository<Blog>, IBlogRepository
{
    public BlogRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Blog?> GetBySlugAsync(string slug)
    {
        return await _dbSet.AsNoTracking()
            .FirstOrDefaultAsync(x => x.Slug == slug);
    }

    public async Task<(IEnumerable<Blog> Items, int TotalCount)> GetPublishedBlogsAsync(int page, int pageSize)
    {
        var query = _dbSet.AsNoTracking()
            .Where(x => x.Status == BlogStatus.Published);

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(x => x.PublishedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }
}
