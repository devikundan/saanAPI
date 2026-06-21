using ITServices.Domain.Entities;

namespace ITServices.Domain.Interfaces;

public interface IContactMessageRepository : IGenericRepository<ContactMessage>
{
    Task<IEnumerable<ContactMessage>> GetUnreadMessagesAsync();
}
