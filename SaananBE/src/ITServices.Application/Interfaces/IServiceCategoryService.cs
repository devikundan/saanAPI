using ITServices.Application.DTOs.Common;
using ITServices.Application.DTOs.ServiceCategories;

namespace ITServices.Application.Interfaces;

public interface IServiceCategoryService
{
    Task<ApiResponse<List<ServiceCategoryResponseDto>>> GetActiveCategoriesAsync();
    Task<ApiResponse<List<ServiceCategoryWithServicesDto>>> GetActiveCategoriesWithServicesAsync();
    Task<ApiResponse<PaginatedResult<ServiceCategoryResponseDto>>> GetAllPaginatedAsync(int page, int pageSize);
    Task<ApiResponse<ServiceCategoryResponseDto>> GetByIdAsync(Guid id);
    Task<ApiResponse<ServiceCategoryResponseDto>> CreateAsync(CreateServiceCategoryRequestDto request);
    Task<ApiResponse<ServiceCategoryResponseDto>> UpdateAsync(Guid id, UpdateServiceCategoryRequestDto request);
    Task<ApiResponse<bool>> DeleteAsync(Guid id);
}
