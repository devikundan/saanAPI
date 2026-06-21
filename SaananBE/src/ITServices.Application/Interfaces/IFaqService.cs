using ITServices.Application.DTOs.Common;
using ITServices.Application.DTOs.Faqs;

namespace ITServices.Application.Interfaces;

public interface IFaqService
{
    Task<ApiResponse<List<FaqResponseDto>>> GetActiveFaqsAsync();
    Task<ApiResponse<PaginatedResult<FaqResponseDto>>> GetAllPaginatedAsync(int page, int pageSize);
    Task<ApiResponse<FaqResponseDto>> GetByIdAsync(Guid id);
    Task<ApiResponse<FaqResponseDto>> CreateAsync(CreateFaqRequestDto request);
    Task<ApiResponse<FaqResponseDto>> UpdateAsync(Guid id, UpdateFaqRequestDto request);
    Task<ApiResponse<bool>> DeleteAsync(Guid id);
}
