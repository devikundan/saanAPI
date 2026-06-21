namespace ITServices.Application.DTOs.Testimonials;

public class UpdateTestimonialRequestDto
{
    public string ClientName { get; set; } = string.Empty;
    public string? ClientTitle { get; set; }
    public string? ClientImageUrl { get; set; }
    public string Content { get; set; } = string.Empty;
    public int Rating { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
}
