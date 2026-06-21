using ITServices.Domain.Entities;
using ITServices.Domain.Interfaces;
using ITServices.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ITServices.Infrastructure.Repositories;

public class ContactMessageRepository : GenericRepository<ContactMessage>, IContactMessageRepository
{
    public ContactMessageRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<ContactMessage>> GetUnreadMessagesAsync()
    {
        return await _dbSet.AsNoTracking()
            .Where(x => !x.IsRead)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
    }
}
