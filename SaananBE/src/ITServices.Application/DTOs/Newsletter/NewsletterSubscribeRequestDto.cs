namespace ITServices.Application.DTOs.Newsletter;

public class NewsletterSubscribeRequestDto
{
    public string Email { get; set; } = string.Empty;
    public string? Name { get; set; }
}
