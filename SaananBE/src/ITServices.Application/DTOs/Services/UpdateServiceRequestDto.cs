namespace ITServices.Application.DTOs.Services;

public class UpdateServiceRequestDto
{
    public string Title { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public string ShortDescription { get; set; } = string.Empty;
    public string DetailedDescription { get; set; } = string.Empty;
    public string? IconUrl { get; set; }
    public Guid ServiceCategoryId { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
}
