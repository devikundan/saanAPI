namespace ITServices.Domain.Entities;

public class Service
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string DetailedDescription { get; set; } = string.Empty;
    public string IconUrl { get; set; } = string.Empty;
    public Guid ServiceCategoryId { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ServiceCategory ServiceCategory { get; set; } = null!;
    public ICollection<Lead> Leads { get; set; } = new List<Lead>();
}
