using FluentValidation;
using ITServices.Application.DTOs.Common;
using ITServices.Application.DTOs.Leads;
using ITServices.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace ITServices.API.Controllers.Public;

[ApiController]
[Route("api/leads")]
[ApiExplorerSettings(GroupName = "public")]
[EnableRateLimiting("PublicEndpoint")]
public class LeadsController : ControllerBase
{
    private readonly ILeadService _leadService;
    private readonly IValidator<CreateLeadRequestDto> _validator;

    public LeadsController(ILeadService leadService, IValidator<CreateLeadRequestDto> validator)
    {
        _leadService = leadService;
        _validator = validator;
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<LeadConfirmationDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<LeadConfirmationDto>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> SubmitLead([FromBody] CreateLeadRequestDto request)
    {
        var validation = await _validator.ValidateAsync(request);
        if (!validation.IsValid)
        {
            var errors = validation.Errors.Select(e => e.ErrorMessage).ToList();
            return BadRequest(ApiResponse<LeadConfirmationDto>.FailResponse("Validation failed.", errors));
        }

        var result = await _leadService.CreateAsync(request);
        return StatusCode(StatusCodes.Status201Created, result);
    }
}
