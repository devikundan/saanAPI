using FluentValidation;
using ITServices.Application.DTOs.Common;
using ITServices.Application.DTOs.ProposalSummary;
using ITServices.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ITServices.API.Controllers.Admin;

[ApiController]
[Route("api/admin/proposals")]
[Authorize]
[ApiExplorerSettings(GroupName = "admin")]
public class AdminProposalsController : ControllerBase
{
    private readonly IProposalSummaryService _proposalService;
    private readonly IValidator<GenerateProposalRequestDto> _validator;

    public AdminProposalsController(
        IProposalSummaryService proposalService,
        IValidator<GenerateProposalRequestDto> validator)
    {
        _proposalService = proposalService;
        _validator = validator;
    }

    [HttpPost("generate")]
    [ProducesResponseType(typeof(ApiResponse<ProposalSummaryResponseDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<ProposalSummaryResponseDto>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GenerateProposal([FromBody] GenerateProposalRequestDto request)
    {
        var validation = await _validator.ValidateAsync(request);
        if (!validation.IsValid)
        {
            var errors = validation.Errors.Select(e => e.ErrorMessage).ToList();
            return BadRequest(ApiResponse<ProposalSummaryResponseDto>.FailResponse("Validation failed.", errors));
        }

        var result = await _proposalService.GenerateProposalAsync(request);
        if (!result.Success)
            return BadRequest(result);
        return StatusCode(StatusCodes.Status201Created, result);
    }

    [HttpGet("recent")]
    [ProducesResponseType(typeof(ApiResponse<List<ProposalSummaryResponseDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetRecent([FromQuery] int count = 20)
    {
        var result = await _proposalService.GetRecentProposalsAsync(count);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<ProposalSummaryResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<ProposalSummaryResponseDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _proposalService.GetByIdAsync(id);
        if (!result.Success)
            return NotFound(result);
        return Ok(result);
    }

    [HttpGet("lead/{leadId:guid}")]
    [ProducesResponseType(typeof(ApiResponse<ProposalSummaryResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<ProposalSummaryResponseDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetByLeadId(Guid leadId)
    {
        var result = await _proposalService.GetByLeadIdAsync(leadId);
        if (!result.Success)
            return NotFound(result);
        return Ok(result);
    }
}
