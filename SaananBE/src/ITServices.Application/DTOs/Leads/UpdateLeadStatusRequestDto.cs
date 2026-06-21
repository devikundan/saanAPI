using ITServices.Domain.Enums;

namespace ITServices.Application.DTOs.Leads;

public class UpdateLeadStatusRequestDto
{
    public LeadStatus Status { get; set; }
    public string? AdminNotes { get; set; }
}
