namespace ITServices.Application.DTOs.ServiceCategories;

public class UpdateServiceCategoryRequestDto
{
    public string Name { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public string? Description { get; set; }
    public string? IconUrl { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
}
