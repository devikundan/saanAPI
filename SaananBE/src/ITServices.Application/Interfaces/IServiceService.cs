using ITServices.Application.DTOs.Common;
using ITServices.Application.DTOs.Services;

namespace ITServices.Application.Interfaces;

public interface IServiceService
{
    Task<ApiResponse<List<ServiceResponseDto>>> GetActiveServicesAsync();
    Task<ApiResponse<ServiceResponseDto>> GetBySlugAsync(string slug);
    Task<ApiResponse<PaginatedResult<ServiceResponseDto>>> GetAllPaginatedAsync(int page, int pageSize);
    Task<ApiResponse<ServiceResponseDto>> GetByIdAsync(Guid id);
    Task<ApiResponse<ServiceResponseDto>> CreateAsync(CreateServiceRequestDto request);
    Task<ApiResponse<ServiceResponseDto>> UpdateAsync(Guid id, UpdateServiceRequestDto request);
    Task<ApiResponse<bool>> DeleteAsync(Guid id);
}
