using ITServices.Application.DTOs.Blogs;
using ITServices.Application.DTOs.Common;

namespace ITServices.Application.Interfaces;

public interface IBlogService
{
    Task<ApiResponse<PaginatedResult<BlogListResponseDto>>> GetPublishedBlogsAsync(int page, int pageSize);
    Task<ApiResponse<BlogResponseDto>> GetBySlugAsync(string slug);
    Task<ApiResponse<PaginatedResult<BlogResponseDto>>> GetAllPaginatedAsync(int page, int pageSize);
    Task<ApiResponse<BlogResponseDto>> GetByIdAsync(Guid id);
    Task<ApiResponse<BlogResponseDto>> CreateAsync(CreateBlogRequestDto request);
    Task<ApiResponse<BlogResponseDto>> UpdateAsync(Guid id, UpdateBlogRequestDto request);
    Task<ApiResponse<bool>> DeleteAsync(Guid id);
}
