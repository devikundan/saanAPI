namespace ITServices.Application.DTOs.Portfolio;

public class UpdatePortfolioRequestDto
{
    public string Title { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? ClientName { get; set; }
    public string? ProjectUrl { get; set; }
    public string? ThumbnailUrl { get; set; }
    public string? Technologies { get; set; }
    public DateTime? CompletedAt { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
}
