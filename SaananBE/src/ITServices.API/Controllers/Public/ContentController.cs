using ITServices.Application.DTOs.Common;
using ITServices.Application.DTOs.Content;
using ITServices.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace ITServices.API.Controllers.Public;

[ApiController]
[Route("api/content")]
[ApiExplorerSettings(GroupName = "public")]
[EnableRateLimiting("GeneralApi")]
public class ContentController : ControllerBase
{
    private readonly IContentService _contentService;

    public ContentController(IContentService contentService)
    {
        _contentService = contentService;
    }

    [HttpGet("{sectionKey}")]
    [ProducesResponseType(typeof(ApiResponse<ContentResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<ContentResponseDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetBySectionKey(string sectionKey)
    {
        var result = await _contentService.GetBySectionKeyAsync(sectionKey);
        if (!result.Success)
            return NotFound(result);
        return Ok(result);
    }
}
