namespace ITServices.Application.DTOs.ProposalSummary;

public class GenerateProposalRequestDto
{
    public Guid LeadId { get; set; }
    public string ClientName { get; set; } = string.Empty;
    public string ProjectScope { get; set; } = string.Empty;
    public string? PreferredTechStack { get; set; }
    public string? BudgetRange { get; set; }
    public string? Timeline { get; set; }
}
