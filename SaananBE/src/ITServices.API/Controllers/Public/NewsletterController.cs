using FluentValidation;
using ITServices.Application.DTOs.Common;
using ITServices.Application.DTOs.Newsletter;
using ITServices.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace ITServices.API.Controllers.Public;

[ApiController]
[Route("api/newsletter")]
[ApiExplorerSettings(GroupName = "public")]
[EnableRateLimiting("PublicEndpoint")]
public class NewsletterController : ControllerBase
{
    private readonly INewsletterService _newsletterService;
    private readonly IValidator<NewsletterSubscribeRequestDto> _validator;

    public NewsletterController(INewsletterService newsletterService, IValidator<NewsletterSubscribeRequestDto> validator)
    {
        _newsletterService = newsletterService;
        _validator = validator;
    }

    [HttpPost("subscribe")]
    [ProducesResponseType(typeof(ApiResponse<NewsletterConfirmationDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<NewsletterConfirmationDto>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Subscribe([FromBody] NewsletterSubscribeRequestDto request)
    {
        var validation = await _validator.ValidateAsync(request);
        if (!validation.IsValid)
        {
            var errors = validation.Errors.Select(e => e.ErrorMessage).ToList();
            return BadRequest(ApiResponse<NewsletterConfirmationDto>.FailResponse("Validation failed.", errors));
        }

        var result = await _newsletterService.SubscribeAsync(request);
        if (!result.Success)
            return BadRequest(result);
        return StatusCode(StatusCodes.Status201Created, result);
    }

    [HttpPost("unsubscribe")]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Unsubscribe([FromQuery] string email)
    {
        var result = await _newsletterService.UnsubscribeAsync(email);
        if (!result.Success)
            return BadRequest(result);
        return Ok(result);
    }
}
