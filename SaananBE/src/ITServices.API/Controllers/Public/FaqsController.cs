using ITServices.Application.DTOs.Common;
using ITServices.Application.DTOs.Faqs;
using ITServices.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace ITServices.API.Controllers.Public;

[ApiController]
[Route("api/faqs")]
[ApiExplorerSettings(GroupName = "public")]
[EnableRateLimiting("GeneralApi")]
public class FaqsController : ControllerBase
{
    private readonly IFaqService _faqService;

    public FaqsController(IFaqService faqService)
    {
        _faqService = faqService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<FaqResponseDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetActiveFaqs()
    {
        var result = await _faqService.GetActiveFaqsAsync();
        return Ok(result);
    }
}
