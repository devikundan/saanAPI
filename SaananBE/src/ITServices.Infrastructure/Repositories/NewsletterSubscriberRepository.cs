using ITServices.Domain.Entities;
using ITServices.Domain.Interfaces;
using ITServices.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ITServices.Infrastructure.Repositories;

public class NewsletterSubscriberRepository : GenericRepository<NewsletterSubscriber>, INewsletterSubscriberRepository
{
    public NewsletterSubscriberRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<NewsletterSubscriber?> GetByEmailAsync(string email)
    {
        return await _dbSet.FirstOrDefaultAsync(x => x.Email == email);
    }

    public async Task<IEnumerable<NewsletterSubscriber>> GetActiveSubscribersAsync()
    {
        return await _dbSet.AsNoTracking()
            .Where(x => x.IsActive)
            .OrderByDescending(x => x.SubscribedAt)
            .ToListAsync();
    }
}
