using ITServices.Domain.Entities;

namespace ITServices.Domain.Interfaces;

public interface INewsletterSubscriberRepository : IGenericRepository<NewsletterSubscriber>
{
    Task<NewsletterSubscriber?> GetByEmailAsync(string email);
    Task<IEnumerable<NewsletterSubscriber>> GetActiveSubscribersAsync();
}
