using ITServices.Application.DTOs.Common;
using ITServices.Application.DTOs.Newsletter;
using ITServices.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ITServices.API.Controllers.Admin;

[ApiController]
[Route("api/admin/newsletter")]
[Authorize]
[ApiExplorerSettings(GroupName = "admin")]
public class AdminNewsletterController : ControllerBase
{
    private readonly INewsletterService _newsletterService;

    public AdminNewsletterController(INewsletterService newsletterService)
    {
        _newsletterService = newsletterService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<PaginatedResult<NewsletterSubscriberResponseDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        pageSize = Math.Min(pageSize, 50);
        var result = await _newsletterService.GetAllSubscribersAsync(page, pageSize);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _newsletterService.DeleteSubscriberAsync(id);
        if (!result.Success)
            return NotFound(result);
        return Ok(result);
    }
}
