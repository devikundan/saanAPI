namespace ITServices.Application.DTOs.Analytics;

public class DashboardSummaryDto
{
    public int TotalLeads { get; set; }
    public int NewLeadsToday { get; set; }
    public int NewLeadsThisWeek { get; set; }
    public int NewLeadsThisMonth { get; set; }
    public int TotalContactMessages { get; set; }
    public int UnreadContactMessages { get; set; }
    public int TotalNewsletterSubscribers { get; set; }
    public int ActiveServices { get; set; }
    public int PublishedBlogs { get; set; }
    public int ActivePortfolioProjects { get; set; }
    public List<LeadsByStatusDto> LeadsByStatus { get; set; } = new();
    public List<LeadsByServiceDto> LeadsByService { get; set; } = new();
    public List<MonthlyLeadTrendDto> MonthlyLeadTrend { get; set; } = new();
}

public class LeadsByStatusDto
{
    public string Status { get; set; } = string.Empty;
    public int Count { get; set; }
}

public class LeadsByServiceDto
{
    public string ServiceTitle { get; set; } = string.Empty;
    public int Count { get; set; }
}

public class MonthlyLeadTrendDto
{
    public string Month { get; set; } = string.Empty;
    public int Year { get; set; }
    public int Count { get; set; }
}
