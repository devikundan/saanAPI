namespace ITServices.Domain.Entities;

public class Testimonial
{
    public Guid Id { get; set; }
    public string ClientName { get; set; } = string.Empty;
    public string? ClientTitle { get; set; }
    public string? ClientImageUrl { get; set; }
    public string Content { get; set; } = string.Empty;
    public int Rating { get; set; }
    public bool IsActive { get; set; } = true;
    public int DisplayOrder { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
