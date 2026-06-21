using FluentValidation;
using ITServices.Application.DTOs.Common;
using ITServices.Application.DTOs.QueryClassification;
using ITServices.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ITServices.API.Controllers.Admin;

[ApiController]
[Route("api/admin/query-classification")]
[Authorize]
[ApiExplorerSettings(GroupName = "admin")]
public class AdminQueryClassificationController : ControllerBase
{
    private readonly IQueryClassificationService _classificationService;
    private readonly IValidator<ClassifyQueryRequestDto> _validator;

    public AdminQueryClassificationController(
        IQueryClassificationService classificationService,
        IValidator<ClassifyQueryRequestDto> validator)
    {
        _classificationService = classificationService;
        _validator = validator;
    }

    [HttpPost("classify")]
    [ProducesResponseType(typeof(ApiResponse<QueryClassificationResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<QueryClassificationResponseDto>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ClassifyQuery([FromBody] ClassifyQueryRequestDto request)
    {
        var validation = await _validator.ValidateAsync(request);
        if (!validation.IsValid)
        {
            var errors = validation.Errors.Select(e => e.ErrorMessage).ToList();
            return BadRequest(ApiResponse<QueryClassificationResponseDto>.FailResponse("Validation failed.", errors));
        }

        var result = await _classificationService.ClassifyQueryAsync(request);
        return Ok(result);
    }

    [HttpGet("recent")]
    [ProducesResponseType(typeof(ApiResponse<List<QueryClassificationResponseDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetRecent([FromQuery] int count = 20)
    {
        var result = await _classificationService.GetRecentClassificationsAsync(count);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<QueryClassificationResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<QueryClassificationResponseDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _classificationService.GetByIdAsync(id);
        if (!result.Success)
            return NotFound(result);
        return Ok(result);
    }
}
