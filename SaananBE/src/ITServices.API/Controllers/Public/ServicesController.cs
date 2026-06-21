using ITServices.Application.DTOs.Common;
using ITServices.Application.DTOs.Services;
using ITServices.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace ITServices.API.Controllers.Public;

[ApiController]
[Route("api/services")]
[ApiExplorerSettings(GroupName = "public")]
[EnableRateLimiting("GeneralApi")]
public class ServicesController : ControllerBase
{
    private readonly IServiceService _serviceService;

    public ServicesController(IServiceService serviceService)
    {
        _serviceService = serviceService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<ServiceResponseDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetActiveServices()
    {
        var result = await _serviceService.GetActiveServicesAsync();
        return Ok(result);
    }

    [HttpGet("{slug}")]
    [ProducesResponseType(typeof(ApiResponse<ServiceResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<ServiceResponseDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var result = await _serviceService.GetBySlugAsync(slug);
        if (!result.Success)
            return NotFound(result);
        return Ok(result);
    }
}
