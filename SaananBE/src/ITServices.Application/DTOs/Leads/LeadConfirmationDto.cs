namespace ITServices.Application.DTOs.Leads;

public class LeadConfirmationDto
{
    public Guid Id { get; set; }
    public string Message { get; set; } = "Your inquiry has been submitted successfully. We will get back to you soon.";
}
