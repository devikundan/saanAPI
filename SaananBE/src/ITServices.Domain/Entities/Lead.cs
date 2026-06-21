using ITServices.Domain.Enums;

namespace ITServices.Domain.Entities;

public class Lead
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Company { get; set; }
    public Guid? ServiceId { get; set; }
    public string Message { get; set; } = string.Empty;
    public LeadStatus Status { get; set; } = LeadStatus.New;
    public string? AdminNotes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public Service? Service { get; set; }
}
