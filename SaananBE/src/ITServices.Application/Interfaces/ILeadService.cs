using ITServices.Application.DTOs.Common;
using ITServices.Application.DTOs.Leads;

namespace ITServices.Application.Interfaces;

public interface ILeadService
{
    Task<ApiResponse<LeadConfirmationDto>> CreateAsync(CreateLeadRequestDto request);
    Task<ApiResponse<PaginatedResult<LeadResponseDto>>> GetAllPaginatedAsync(int page, int pageSize);
    Task<ApiResponse<LeadResponseDto>> GetByIdAsync(Guid id);
    Task<ApiResponse<LeadResponseDto>> UpdateStatusAsync(Guid id, UpdateLeadStatusRequestDto request);
    Task<ApiResponse<bool>> DeleteAsync(Guid id);
}
