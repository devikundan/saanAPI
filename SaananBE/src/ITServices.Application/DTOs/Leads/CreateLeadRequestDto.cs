namespace ITServices.Application.DTOs.Leads;

public class CreateLeadRequestDto
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Company { get; set; }
    public Guid? ServiceId { get; set; }
    public string Message { get; set; } = string.Empty;
}
