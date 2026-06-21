using ITServices.Application.DTOs.Common;
using ITServices.Application.DTOs.Portfolio;
using ITServices.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ITServices.API.Controllers.Admin;

[ApiController]
[Route("api/admin/portfolio")]
[Authorize]
[ApiExplorerSettings(GroupName = "admin")]
public class AdminPortfolioController : ControllerBase
{
    private readonly IPortfolioService _portfolioService;

    public AdminPortfolioController(IPortfolioService portfolioService)
    {
        _portfolioService = portfolioService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<PaginatedResult<PortfolioResponseDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        pageSize = Math.Min(pageSize, 50);
        var result = await _portfolioService.GetAllPaginatedAsync(page, pageSize);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<PortfolioResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<PortfolioResponseDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _portfolioService.GetByIdAsync(id);
        if (!result.Success)
            return NotFound(result);
        return Ok(result);
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<PortfolioResponseDto>), StatusCodes.Status201Created)]
    public async Task<IActionResult> Create([FromBody] CreatePortfolioRequestDto request)
    {
        var result = await _portfolioService.CreateAsync(request);
        return StatusCode(StatusCodes.Status201Created, result);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<PortfolioResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<PortfolioResponseDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdatePortfolioRequestDto request)
    {
        var result = await _portfolioService.UpdateAsync(id, request);
        if (!result.Success)
            return NotFound(result);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _portfolioService.DeleteAsync(id);
        if (!result.Success)
            return NotFound(result);
        return Ok(result);
    }
}
