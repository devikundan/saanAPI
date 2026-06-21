using ITServices.Application.DTOs.Common;
using ITServices.Application.DTOs.Portfolio;
using ITServices.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace ITServices.API.Controllers.Public;

[ApiController]
[Route("api/portfolio")]
[ApiExplorerSettings(GroupName = "public")]
[EnableRateLimiting("GeneralApi")]
public class PortfolioController : ControllerBase
{
    private readonly IPortfolioService _portfolioService;

    public PortfolioController(IPortfolioService portfolioService)
    {
        _portfolioService = portfolioService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<PortfolioResponseDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetActiveProjects()
    {
        var result = await _portfolioService.GetActiveProjectsAsync();
        return Ok(result);
    }

    [HttpGet("{slug}")]
    [ProducesResponseType(typeof(ApiResponse<PortfolioResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<PortfolioResponseDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var result = await _portfolioService.GetBySlugAsync(slug);
        if (!result.Success)
            return NotFound(result);
        return Ok(result);
    }
}
