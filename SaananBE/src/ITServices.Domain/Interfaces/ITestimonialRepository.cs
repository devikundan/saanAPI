using ITServices.Domain.Entities;

namespace ITServices.Domain.Interfaces;

public interface ITestimonialRepository : IGenericRepository<Testimonial>
{
    Task<IEnumerable<Testimonial>> GetActiveTestimonialsAsync();
}
