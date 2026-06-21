namespace ITServices.Application.DTOs.Content;

public class UpdateContentRequestDto
{
    public string Title { get; set; } = string.Empty;
    public string? Body { get; set; }
    public string? ImageUrl { get; set; }
    public string? MetaData { get; set; }
}
