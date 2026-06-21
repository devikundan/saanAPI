using ITServices.Application.DTOs.Common;
using ITServices.Application.DTOs.Testimonials;

namespace ITServices.Application.Interfaces;

public interface ITestimonialService
{
    Task<ApiResponse<List<TestimonialResponseDto>>> GetActiveTestimonialsAsync();
    Task<ApiResponse<PaginatedResult<TestimonialResponseDto>>> GetAllPaginatedAsync(int page, int pageSize);
    Task<ApiResponse<TestimonialResponseDto>> GetByIdAsync(Guid id);
    Task<ApiResponse<TestimonialResponseDto>> CreateAsync(CreateTestimonialRequestDto request);
    Task<ApiResponse<TestimonialResponseDto>> UpdateAsync(Guid id, UpdateTestimonialRequestDto request);
    Task<ApiResponse<bool>> DeleteAsync(Guid id);
}
