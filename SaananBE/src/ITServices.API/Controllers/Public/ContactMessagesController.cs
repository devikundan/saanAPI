using FluentValidation;
using ITServices.Application.DTOs.Common;
using ITServices.Application.DTOs.ContactMessages;
using ITServices.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace ITServices.API.Controllers.Public;

[ApiController]
[Route("api/contact-messages")]
[ApiExplorerSettings(GroupName = "public")]
[EnableRateLimiting("PublicEndpoint")]
public class ContactMessagesController : ControllerBase
{
    private readonly IContactMessageService _contactMessageService;
    private readonly IValidator<CreateContactMessageRequestDto> _validator;

    public ContactMessagesController(IContactMessageService contactMessageService, IValidator<CreateContactMessageRequestDto> validator)
    {
        _contactMessageService = contactMessageService;
        _validator = validator;
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<ContactMessageConfirmationDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<ContactMessageConfirmationDto>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> SubmitContactMessage([FromBody] CreateContactMessageRequestDto request)
    {
        var validation = await _validator.ValidateAsync(request);
        if (!validation.IsValid)
        {
            var errors = validation.Errors.Select(e => e.ErrorMessage).ToList();
            return BadRequest(ApiResponse<ContactMessageConfirmationDto>.FailResponse("Validation failed.", errors));
        }

        var result = await _contactMessageService.CreateAsync(request);
        return StatusCode(StatusCodes.Status201Created, result);
    }
}
