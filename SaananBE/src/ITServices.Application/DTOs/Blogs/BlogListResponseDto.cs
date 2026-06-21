namespace ITServices.Application.DTOs.Blogs;

public class BlogListResponseDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Summary { get; set; }
    public string? FeaturedImageUrl { get; set; }
    public string Author { get; set; } = string.Empty;
    public string? Tags { get; set; }
    public DateTime? PublishedAt { get; set; }
}
