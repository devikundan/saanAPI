using ITServices.Domain.Entities;
using ITServices.Domain.Interfaces;
using ITServices.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ITServices.Infrastructure.Repositories;

public class LeadRepository : GenericRepository<Lead>, ILeadRepository
{
    public LeadRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Lead?> GetByIdWithServiceAsync(Guid id)
    {
        return await _dbSet
            .Include(x => x.Service)
            .FirstOrDefaultAsync(x => x.Id == id);
    }
}
