namespace ITServices.Application.DTOs.ContactMessages;

public class ContactMessageConfirmationDto
{
    public Guid Id { get; set; }
    public string Message { get; set; } = "Your message has been received. We will respond shortly.";
}
