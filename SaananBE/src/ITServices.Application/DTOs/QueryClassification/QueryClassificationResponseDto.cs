namespace ITServices.Application.DTOs.QueryClassification;

public class QueryClassificationResponseDto
{
    public Guid Id { get; set; }
    public string OriginalQuery { get; set; } = string.Empty;
    public string ClassifiedCategory { get; set; } = string.Empty;
    public string? SuggestedServiceSlug { get; set; }
    public double ConfidenceScore { get; set; }
    public string? AiResponse { get; set; }
    public DateTime ClassifiedAt { get; set; }
}
