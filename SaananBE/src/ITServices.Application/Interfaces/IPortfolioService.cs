using ITServices.Application.DTOs.Common;
using ITServices.Application.DTOs.Portfolio;

namespace ITServices.Application.Interfaces;

public interface IPortfolioService
{
    Task<ApiResponse<List<PortfolioResponseDto>>> GetActiveProjectsAsync();
    Task<ApiResponse<PortfolioResponseDto>> GetBySlugAsync(string slug);
    Task<ApiResponse<PaginatedResult<PortfolioResponseDto>>> GetAllPaginatedAsync(int page, int pageSize);
    Task<ApiResponse<PortfolioResponseDto>> GetByIdAsync(Guid id);
    Task<ApiResponse<PortfolioResponseDto>> CreateAsync(CreatePortfolioRequestDto request);
    Task<ApiResponse<PortfolioResponseDto>> UpdateAsync(Guid id, UpdatePortfolioRequestDto request);
    Task<ApiResponse<bool>> DeleteAsync(Guid id);
}
