using ITServices.Application.DTOs.Analytics;
using ITServices.Application.DTOs.Common;
using ITServices.Application.Interfaces;
using ITServices.Domain.Enums;
using ITServices.Domain.Interfaces;

namespace ITServices.Application.Services;

public class AnalyticsService : IAnalyticsService
{
    private readonly ILeadRepository _leadRepository;
    private readonly IContactMessageRepository _contactMessageRepository;
    private readonly INewsletterSubscriberRepository _newsletterRepository;
    private readonly IServiceRepository _serviceRepository;
    private readonly IBlogRepository _blogRepository;
    private readonly IPortfolioRepository _portfolioRepository;

    public AnalyticsService(
        ILeadRepository leadRepository,
        IContactMessageRepository contactMessageRepository,
        INewsletterSubscriberRepository newsletterRepository,
        IServiceRepository serviceRepository,
        IBlogRepository blogRepository,
        IPortfolioRepository portfolioRepository)
    {
        _leadRepository = leadRepository;
        _contactMessageRepository = contactMessageRepository;
        _newsletterRepository = newsletterRepository;
        _serviceRepository = serviceRepository;
        _blogRepository = blogRepository;
        _portfolioRepository = portfolioRepository;
    }

    public async Task<ApiResponse<DashboardSummaryDto>> GetDashboardSummaryAsync()
    {
        var now = DateTime.UtcNow;
        var startOfDay = now.Date;
        var startOfWeek = now.Date.AddDays(-(int)now.DayOfWeek);
        var startOfMonth = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);

        // Get all leads for calculations
        var allLeads = await _leadRepository.GetAllAsync();
        var leadsList = allLeads.ToList();

        // Contact messages
        var unreadMessages = await _contactMessageRepository.GetUnreadMessagesAsync();
        var allMessages = await _contactMessageRepository.GetAllAsync();

        // Newsletter
        var activeSubscribers = await _newsletterRepository.GetActiveSubscribersAsync();

        // Services, blogs, portfolio
        var activeServices = await _serviceRepository.GetActiveServicesAsync();
        var publishedBlogs = await _blogRepository.GetPublishedBlogsAsync(1, 1);
        var activeProjects = await _portfolioRepository.GetActiveProjectsAsync();

        // Leads by status
        var leadsByStatus = leadsList
            .GroupBy(l => l.Status)
            .Select(g => new LeadsByStatusDto
            {
                Status = g.Key.ToString(),
                Count = g.Count()
            })
            .OrderByDescending(x => x.Count)
            .ToList();

        // Leads by service
        var leadsByService = leadsList
            .Where(l => l.Service != null)
            .GroupBy(l => l.Service!.Title)
            .Select(g => new LeadsByServiceDto
            {
                ServiceTitle = g.Key,
                Count = g.Count()
            })
            .OrderByDescending(x => x.Count)
            .Take(10)
            .ToList();

        // Monthly lead trend (last 6 months)
        var sixMonthsAgo = now.AddMonths(-6);
        var monthlyTrend = leadsList
            .Where(l => l.CreatedAt >= sixMonthsAgo)
            .GroupBy(l => new { l.CreatedAt.Year, l.CreatedAt.Month })
            .Select(g => new MonthlyLeadTrendDto
            {
                Month = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMM"),
                Year = g.Key.Year,
                Count = g.Count()
            })
            .OrderBy(x => x.Year).ThenBy(x => x.Month)
            .ToList();

        var summary = new DashboardSummaryDto
        {
            TotalLeads = leadsList.Count,
            NewLeadsToday = leadsList.Count(l => l.CreatedAt >= startOfDay),
            NewLeadsThisWeek = leadsList.Count(l => l.CreatedAt >= startOfWeek),
            NewLeadsThisMonth = leadsList.Count(l => l.CreatedAt >= startOfMonth),
            TotalContactMessages = allMessages.Count(),
            UnreadContactMessages = unreadMessages.Count(),
            TotalNewsletterSubscribers = activeSubscribers.Count(),
            ActiveServices = activeServices.Count(),
            PublishedBlogs = publishedBlogs.TotalCount,
            ActivePortfolioProjects = activeProjects.Count(),
            LeadsByStatus = leadsByStatus,
            LeadsByService = leadsByService,
            MonthlyLeadTrend = monthlyTrend
        };

        return ApiResponse<DashboardSummaryDto>.SuccessResponse(summary);
    }
}
