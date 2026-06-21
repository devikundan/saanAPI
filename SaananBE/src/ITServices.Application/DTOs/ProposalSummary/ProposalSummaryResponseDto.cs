namespace ITServices.Application.DTOs.ProposalSummary;

public class ProposalSummaryResponseDto
{
    public Guid Id { get; set; }
    public Guid LeadId { get; set; }
    public string ClientName { get; set; } = string.Empty;
    public string ProjectScope { get; set; } = string.Empty;
    public string GeneratedSummary { get; set; } = string.Empty;
    public string? EstimatedTimeline { get; set; }
    public string? EstimatedBudgetRange { get; set; }
    public string? RecommendedServices { get; set; }
    public string? TechStack { get; set; }
    public DateTime GeneratedAt { get; set; }
}
