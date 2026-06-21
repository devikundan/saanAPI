using AutoMapper;
using ITServices.Application.DTOs.Common;
using ITServices.Application.DTOs.Testimonials;
using ITServices.Application.Interfaces;
using ITServices.Domain.Entities;
using ITServices.Domain.Interfaces;

namespace ITServices.Application.Services;

public class TestimonialService : ITestimonialService
{
    private readonly ITestimonialRepository _repository;
    private readonly IMapper _mapper;

    public TestimonialService(ITestimonialRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<ApiResponse<List<TestimonialResponseDto>>> GetActiveTestimonialsAsync()
    {
        var testimonials = await _repository.GetActiveTestimonialsAsync();
        var result = _mapper.Map<List<TestimonialResponseDto>>(testimonials);
        return ApiResponse<List<TestimonialResponseDto>>.SuccessResponse(result);
    }

    public async Task<ApiResponse<PaginatedResult<TestimonialResponseDto>>> GetAllPaginatedAsync(int page, int pageSize)
    {
        var (items, totalCount) = await _repository.GetPaginatedAsync(null, page, pageSize, x => x.DisplayOrder);
        var mapped = _mapper.Map<IEnumerable<TestimonialResponseDto>>(items);
        var result = new PaginatedResult<TestimonialResponseDto>
        {
            Items = mapped,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
        return ApiResponse<PaginatedResult<TestimonialResponseDto>>.SuccessResponse(result);
    }

    public async Task<ApiResponse<TestimonialResponseDto>> GetByIdAsync(Guid id)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity == null)
            return ApiResponse<TestimonialResponseDto>.FailResponse("Testimonial not found.");

        var result = _mapper.Map<TestimonialResponseDto>(entity);
        return ApiResponse<TestimonialResponseDto>.SuccessResponse(result);
    }

    public async Task<ApiResponse<TestimonialResponseDto>> CreateAsync(CreateTestimonialRequestDto request)
    {
        var entity = _mapper.Map<Testimonial>(request);
        entity.Id = Guid.NewGuid();
        entity.CreatedAt = DateTime.UtcNow;
        entity.UpdatedAt = DateTime.UtcNow;

        await _repository.AddAsync(entity);
        var result = _mapper.Map<TestimonialResponseDto>(entity);
        return ApiResponse<TestimonialResponseDto>.SuccessResponse(result, "Testimonial created successfully.");
    }

    public async Task<ApiResponse<TestimonialResponseDto>> UpdateAsync(Guid id, UpdateTestimonialRequestDto request)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity == null)
            return ApiResponse<TestimonialResponseDto>.FailResponse("Testimonial not found.");

        entity.ClientName = request.ClientName;
        entity.ClientTitle = request.ClientTitle;
        entity.ClientImageUrl = request.ClientImageUrl;
        entity.Content = request.Content;
        entity.Rating = request.Rating;
        entity.DisplayOrder = request.DisplayOrder;
        entity.IsActive = request.IsActive;
        entity.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(entity);
        var result = _mapper.Map<TestimonialResponseDto>(entity);
        return ApiResponse<TestimonialResponseDto>.SuccessResponse(result, "Testimonial updated successfully.");
    }

    public async Task<ApiResponse<bool>> DeleteAsync(Guid id)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity == null)
            return ApiResponse<bool>.FailResponse("Testimonial not found.");

        await _repository.DeleteAsync(entity);
        return ApiResponse<bool>.SuccessResponse(true, "Testimonial deleted successfully.");
    }
}
