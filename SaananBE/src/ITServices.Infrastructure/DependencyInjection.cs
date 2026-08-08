using ITServices.Application.Interfaces;
using ITServices.Domain.Interfaces;
using ITServices.Infrastructure.Data;
using ITServices.Infrastructure.Repositories;
using ITServices.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ITServices.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // Database
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(
                configuration.GetConnectionString("DefaultConnection"),
                sqlOptions =>
                    sqlOptions.MigrationsAssembly(
                        typeof(ApplicationDbContext).Assembly.FullName
                    )
            )
        );

        // Repositories
        services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
        services.AddScoped<IServiceCategoryRepository, ServiceCategoryRepository>();
        services.AddScoped<IServiceRepository, ServiceRepository>();
        services.AddScoped<ILeadRepository, LeadRepository>();
        services.AddScoped<IContactMessageRepository, ContactMessageRepository>();
        services.AddScoped<IFaqRepository, FaqRepository>();
        services.AddScoped<ITestimonialRepository, TestimonialRepository>();
        services.AddScoped<IPortfolioRepository, PortfolioRepository>();
        services.AddScoped<IBlogRepository, BlogRepository>();
        services.AddScoped<IContentRepository, ContentRepository>();
        services.AddScoped<IAdminUserRepository, AdminUserRepository>();
        services.AddScoped<INewsletterSubscriberRepository, NewsletterSubscriberRepository>();
        services.AddScoped<IQueryClassificationRepository, QueryClassificationRepository>();
        services.AddScoped<IProposalSummaryRepository, ProposalSummaryRepository>();

        // Infrastructure services
        services.AddScoped<IEmailService, EmailService>();

        return services;
    }
}
