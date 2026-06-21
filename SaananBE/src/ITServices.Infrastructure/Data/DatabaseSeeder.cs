using ITServices.Domain.Entities;
using ITServices.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace ITServices.Infrastructure.Data;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<ApplicationDbContext>>();

        try
        {
            await context.Database.MigrateAsync();
            await SeedAdminUserAsync(context, logger);
            await SeedServiceCategoriesAndServicesAsync(context, logger);
            await SeedContentSectionsAsync(context, logger);
            await SeedFaqsAsync(context, logger);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while seeding the database.");
        }
    }

    private static async Task SeedAdminUserAsync(ApplicationDbContext context, ILogger logger)
    {
        if (await context.AdminUsers.AnyAsync())
            return;

        var admin = new AdminUser
        {
            Id = Guid.NewGuid(),
            FullName = "System Admin",
            Email = "admin@itservices.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123", workFactor: 12),
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        context.AdminUsers.Add(admin);
        await context.SaveChangesAsync();
        logger.LogInformation("Admin user seeded successfully.");
    }

    private static async Task SeedServiceCategoriesAndServicesAsync(ApplicationDbContext context, ILogger logger)
    {
        if (await context.ServiceCategories.AnyAsync())
            return;

        var categories = new List<ServiceCategory>
        {
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Development Services",
                Slug = "development-services",
                Description = "Full-stack development services including web, API, and mobile solutions.",
                IconUrl = "/icons/development.svg",
                DisplayOrder = 1,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "AI & Automation",
                Slug = "ai-automation",
                Description = "AI-powered solutions, intelligent agents, and business process automation.",
                IconUrl = "/icons/ai.svg",
                DisplayOrder = 2,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Infrastructure & DevOps",
                Slug = "infrastructure-devops",
                Description = "Cloud infrastructure, CI/CD pipelines, and DevOps consulting.",
                IconUrl = "/icons/devops.svg",
                DisplayOrder = 3,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Data & Analytics",
                Slug = "data-analytics",
                Description = "Database design, data engineering, and business intelligence solutions.",
                IconUrl = "/icons/data.svg",
                DisplayOrder = 4,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        context.ServiceCategories.AddRange(categories);
        await context.SaveChangesAsync();

        // Seed services under each category
        var devCategory = categories[0];
        var aiCategory = categories[1];
        var infraCategory = categories[2];
        var dataCategory = categories[3];

        var services = new List<Service>
        {
            // Development Services
            new()
            {
                Id = Guid.NewGuid(),
                Title = "Website Development",
                Slug = "website-development",
                ShortDescription = "Custom website and web application development using modern frameworks.",
                DetailedDescription = "<p>We build responsive, fast, and scalable websites and web applications using cutting-edge technologies like Angular, React, ASP.NET Core, and more. Our solutions are tailored to meet your business objectives with pixel-perfect designs and seamless user experiences.</p>",
                IconUrl = "/icons/web-dev.svg",
                ServiceCategoryId = devCategory.Id,
                DisplayOrder = 1,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.NewGuid(),
                Title = "API & Backend Development",
                Slug = "api-backend-development",
                ShortDescription = "Robust RESTful APIs and microservices architecture for your applications.",
                DetailedDescription = "<p>We design and develop high-performance APIs and backend systems using ASP.NET Core, Node.js, and cloud-native architectures. Our solutions support scalability, security, and maintainability from day one.</p>",
                IconUrl = "/icons/api.svg",
                ServiceCategoryId = devCategory.Id,
                DisplayOrder = 2,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            // AI & Automation
            new()
            {
                Id = Guid.NewGuid(),
                Title = "AI Agents & Chatbots",
                Slug = "ai-agents",
                ShortDescription = "Intelligent AI agents and conversational chatbots for customer engagement.",
                DetailedDescription = "<p>We build intelligent AI agents using Azure OpenAI, custom LLMs, and NLP pipelines. From customer support chatbots to complex decision-making agents, we deliver AI solutions that understand context and drive results.</p>",
                IconUrl = "/icons/ai-agent.svg",
                ServiceCategoryId = aiCategory.Id,
                DisplayOrder = 1,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.NewGuid(),
                Title = "Business Process Automation",
                Slug = "automation",
                ShortDescription = "Automate repetitive tasks and streamline business workflows.",
                DetailedDescription = "<p>We identify automation opportunities in your workflows and implement solutions using RPA tools, custom scripts, and integration platforms. Reduce manual effort and minimize errors with intelligent automation.</p>",
                IconUrl = "/icons/automation.svg",
                ServiceCategoryId = aiCategory.Id,
                DisplayOrder = 2,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            // Infrastructure & DevOps
            new()
            {
                Id = Guid.NewGuid(),
                Title = "Cloud Solutions",
                Slug = "cloud-solutions",
                ShortDescription = "Cloud migration, architecture, and management on Azure, AWS, and GCP.",
                DetailedDescription = "<p>We help businesses migrate to the cloud, design cloud-native architectures, and optimize cloud costs. Our expertise spans Azure, AWS, and GCP with a focus on security, reliability, and performance.</p>",
                IconUrl = "/icons/cloud.svg",
                ServiceCategoryId = infraCategory.Id,
                DisplayOrder = 1,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.NewGuid(),
                Title = "DevOps & CI/CD",
                Slug = "devops",
                ShortDescription = "End-to-end DevOps pipelines for faster, reliable software delivery.",
                DetailedDescription = "<p>We implement CI/CD pipelines, infrastructure-as-code, containerization, and monitoring solutions. Our DevOps practices ensure rapid deployments, consistent environments, and quick rollback capabilities.</p>",
                IconUrl = "/icons/devops-service.svg",
                ServiceCategoryId = infraCategory.Id,
                DisplayOrder = 2,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            // Data & Analytics
            new()
            {
                Id = Guid.NewGuid(),
                Title = "Database Design & Optimization",
                Slug = "database-design",
                ShortDescription = "Efficient database architecture, migration, and performance tuning.",
                DetailedDescription = "<p>We design and optimize database schemas for SQL Server, PostgreSQL, MongoDB, and other platforms. Our services include performance tuning, migration planning, and data modeling for scalable applications.</p>",
                IconUrl = "/icons/database.svg",
                ServiceCategoryId = dataCategory.Id,
                DisplayOrder = 1,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.NewGuid(),
                Title = "Custom IT Solutions",
                Slug = "custom-it-solutions",
                ShortDescription = "Bespoke IT solutions tailored to your unique business challenges.",
                DetailedDescription = "<p>Can't find what you need in our standard offerings? We work with you to understand your unique challenges and craft custom IT solutions that align with your goals, timeline, and budget.</p>",
                IconUrl = "/icons/custom.svg",
                ServiceCategoryId = dataCategory.Id,
                DisplayOrder = 2,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        context.Services.AddRange(services);
        await context.SaveChangesAsync();
        logger.LogInformation("Service categories and services seeded successfully.");
    }

    private static async Task SeedContentSectionsAsync(ApplicationDbContext context, ILogger logger)
    {
        if (await context.Contents.AnyAsync())
            return;

        var sections = new List<Content>
        {
            new()
            {
                Id = Guid.NewGuid(),
                SectionKey = "hero",
                Title = "Transform Your Business with IT Excellence",
                Body = "<p>We deliver cutting-edge IT solutions that drive growth, efficiency, and innovation. From AI-powered agents to scalable cloud architectures, we turn your vision into reality.</p>",
                ImageUrl = "/images/hero-bg.jpg",
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.NewGuid(),
                SectionKey = "about",
                Title = "About Our Company",
                Body = "<p>We are a team of passionate IT professionals dedicated to delivering exceptional digital solutions. With years of experience across diverse industries, we combine technical expertise with business insight to create solutions that matter.</p>",
                ImageUrl = "/images/about.jpg",
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.NewGuid(),
                SectionKey = "why-choose-us",
                Title = "Why Choose Us",
                Body = "<p>We combine deep technical expertise with a client-first approach. Our agile methodology ensures fast delivery without compromising quality. We don't just build software; we build partnerships.</p>",
                MetaData = "{\"features\":[\"Expert Team\",\"Agile Delivery\",\"24/7 Support\",\"Transparent Pricing\"]}",
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.NewGuid(),
                SectionKey = "contact",
                Title = "Get In Touch",
                Body = "<p>Ready to start your next project? Contact us today for a free consultation.</p>",
                MetaData = "{\"email\":\"contact@itservices.com\",\"phone\":\"+1-555-0100\",\"address\":\"123 Tech Lane, Innovation City\"}",
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.NewGuid(),
                SectionKey = "footer",
                Title = "IT Services",
                Body = "<p>Delivering IT excellence since 2020. Your trusted technology partner.</p>",
                MetaData = "{\"social\":{\"linkedin\":\"https://linkedin.com\",\"twitter\":\"https://twitter.com\",\"github\":\"https://github.com\"}}",
                UpdatedAt = DateTime.UtcNow
            }
        };

        context.Contents.AddRange(sections);
        await context.SaveChangesAsync();
        logger.LogInformation("Content sections seeded successfully.");
    }

    private static async Task SeedFaqsAsync(ApplicationDbContext context, ILogger logger)
    {
        if (await context.Faqs.AnyAsync())
            return;

        var faqs = new List<Faq>
        {
            new()
            {
                Id = Guid.NewGuid(),
                Question = "What technologies do you work with?",
                Answer = "We work with a wide range of technologies including .NET/C#, Angular, React, Node.js, Python, Azure, AWS, SQL Server, PostgreSQL, MongoDB, Docker, Kubernetes, and more.",
                Category = "General",
                DisplayOrder = 1,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.NewGuid(),
                Question = "How long does a typical project take?",
                Answer = "Project timelines vary based on complexity and scope. A simple website may take 2-4 weeks, while enterprise applications can take 3-6 months. We provide detailed timelines during the proposal phase.",
                Category = "Process",
                DisplayOrder = 2,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.NewGuid(),
                Question = "Do you offer ongoing support and maintenance?",
                Answer = "Yes, we offer flexible support and maintenance packages including bug fixes, feature updates, performance monitoring, and 24/7 emergency support for critical systems.",
                Category = "Support",
                DisplayOrder = 3,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.NewGuid(),
                Question = "What is your pricing model?",
                Answer = "We offer flexible pricing including fixed-price projects, time & materials, and dedicated team models. Each project receives a detailed quote based on requirements and scope.",
                Category = "Pricing",
                DisplayOrder = 4,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.NewGuid(),
                Question = "Can you work with our existing team?",
                Answer = "Absolutely! We seamlessly integrate with your existing teams through staff augmentation, consulting, or collaborative development approaches. We adapt to your workflows and tools.",
                Category = "General",
                DisplayOrder = 5,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        context.Faqs.AddRange(faqs);
        await context.SaveChangesAsync();
        logger.LogInformation("FAQs seeded successfully.");
    }
}
