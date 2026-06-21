using ITServices.Application.DTOs.Common;
using ITServices.Application.DTOs.Testimonials;
using ITServices.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace ITServices.API.Controllers.Public;

[ApiController]
[Route("api/testimonials")]
[ApiExplorerSettings(GroupName = "public")]
[EnableRateLimiting("GeneralApi")]
public class TestimonialsController : ControllerBase
{
    private readonly ITestimonialService _testimonialService;

    public TestimonialsController(ITestimonialService testimonialService)
    {
        _testimonialService = testimonialService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<TestimonialResponseDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetActiveTestimonials()
    {
        var result = await _testimonialService.GetActiveTestimonialsAsync();
        return Ok(result);
    }
}
