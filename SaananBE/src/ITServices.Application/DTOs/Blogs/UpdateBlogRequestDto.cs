using ITServices.Domain.Enums;

namespace ITServices.Application.DTOs.Blogs;

public class UpdateBlogRequestDto
{
    public string Title { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public string? Summary { get; set; }
    public string Content { get; set; } = string.Empty;
    public string? FeaturedImageUrl { get; set; }
    public string Author { get; set; } = string.Empty;
    public string? Tags { get; set; }
    public BlogStatus Status { get; set; }
}
