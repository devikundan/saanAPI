using ITServices.Application.DTOs.Common;
using ITServices.Application.DTOs.ProposalSummary;

namespace ITServices.Application.Interfaces;

public interface IProposalSummaryService
{
    Task<ApiResponse<ProposalSummaryResponseDto>> GenerateProposalAsync(GenerateProposalRequestDto request);
    Task<ApiResponse<ProposalSummaryResponseDto>> GetByLeadIdAsync(Guid leadId);
    Task<ApiResponse<ProposalSummaryResponseDto>> GetByIdAsync(Guid id);
    Task<ApiResponse<List<ProposalSummaryResponseDto>>> GetRecentProposalsAsync(int count = 20);
}
