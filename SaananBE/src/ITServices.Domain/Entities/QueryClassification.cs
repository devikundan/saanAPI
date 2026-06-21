namespace ITServices.Domain.Entities;

public class QueryClassification
{
    public Guid Id { get; set; }
    public Guid? LeadId { get; set; }
    public Guid? ContactMessageId { get; set; }
    public string OriginalQuery { get; set; } = string.Empty;
    public string ClassifiedCategory { get; set; } = string.Empty;
    public string? SuggestedServiceSlug { get; set; }
    public double ConfidenceScore { get; set; }
    public string? AiResponse { get; set; }
    public DateTime ClassifiedAt { get; set; } = DateTime.UtcNow;

    public Lead? Lead { get; set; }
    public ContactMessage? ContactMessage { get; set; }
}
