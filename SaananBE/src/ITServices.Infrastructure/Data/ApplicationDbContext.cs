using ITServices.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ITServices.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<ServiceCategory> ServiceCategories => Set<ServiceCategory>();
    public DbSet<Service> Services => Set<Service>();
    public DbSet<Lead> Leads => Set<Lead>();
    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();
    public DbSet<Faq> Faqs => Set<Faq>();
    public DbSet<Testimonial> Testimonials => Set<Testimonial>();
    public DbSet<PortfolioProject> PortfolioProjects => Set<PortfolioProject>();
    public DbSet<Blog> Blogs => Set<Blog>();
    public DbSet<Content> Contents => Set<Content>();
    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();
    public DbSet<NewsletterSubscriber> NewsletterSubscribers => Set<NewsletterSubscriber>();
    public DbSet<QueryClassification> QueryClassifications => Set<QueryClassification>();
    public DbSet<ProposalSummary> ProposalSummaries => Set<ProposalSummary>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}
