using ITServices.Application.DTOs.Common;
using ITServices.Application.DTOs.Content;
using ITServices.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ITServices.API.Controllers.Admin;

[ApiController]
[Route("api/admin/content")]
[Authorize]
[ApiExplorerSettings(GroupName = "admin")]
public class AdminContentController : ControllerBase
{
    private readonly IContentService _contentService;

    public AdminContentController(IContentService contentService)
    {
        _contentService = contentService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<ContentResponseDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        var result = await _contentService.GetAllSectionsAsync();
        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<ContentResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<ContentResponseDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateContentRequestDto request)
    {
        var result = await _contentService.UpdateAsync(id, request);
        if (!result.Success)
            return NotFound(result);
        return Ok(result);
    }
}
