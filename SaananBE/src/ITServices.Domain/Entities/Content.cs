namespace ITServices.Domain.Entities;

public class Content
{
    public Guid Id { get; set; }
    public string SectionKey { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Body { get; set; }
    public string? ImageUrl { get; set; }
    public string? MetaData { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
