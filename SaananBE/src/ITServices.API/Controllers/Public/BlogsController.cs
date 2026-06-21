using ITServices.Application.DTOs.Blogs;
using ITServices.Application.DTOs.Common;
using ITServices.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace ITServices.API.Controllers.Public;

[ApiController]
[Route("api/blogs")]
[ApiExplorerSettings(GroupName = "public")]
[EnableRateLimiting("GeneralApi")]
public class BlogsController : ControllerBase
{
    private readonly IBlogService _blogService;

    public BlogsController(IBlogService blogService)
    {
        _blogService = blogService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<PaginatedResult<BlogListResponseDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPublishedBlogs([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        pageSize = Math.Min(pageSize, 50);
        var result = await _blogService.GetPublishedBlogsAsync(page, pageSize);
        return Ok(result);
    }

    [HttpGet("{slug}")]
    [ProducesResponseType(typeof(ApiResponse<BlogResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<BlogResponseDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var result = await _blogService.GetBySlugAsync(slug);
        if (!result.Success)
            return NotFound(result);
        return Ok(result);
    }
}
