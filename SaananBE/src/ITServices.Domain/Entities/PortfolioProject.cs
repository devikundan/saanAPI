namespace ITServices.Domain.Entities;

public class PortfolioProject
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? ClientName { get; set; }
    public string? ProjectUrl { get; set; }
    public string? ThumbnailUrl { get; set; }
    public string? Technologies { get; set; }
    public DateTime? CompletedAt { get; set; }
    public bool IsActive { get; set; } = true;
    public int DisplayOrder { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
