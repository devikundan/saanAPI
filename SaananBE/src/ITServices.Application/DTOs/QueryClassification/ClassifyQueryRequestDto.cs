namespace ITServices.Application.DTOs.QueryClassification;

public class ClassifyQueryRequestDto
{
    public string Query { get; set; } = string.Empty;
    public Guid? LeadId { get; set; }
    public Guid? ContactMessageId { get; set; }
}
