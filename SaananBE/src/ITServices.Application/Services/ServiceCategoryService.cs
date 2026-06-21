using AutoMapper;
using ITServices.Application.DTOs.Common;
using ITServices.Application.DTOs.ServiceCategories;
using ITServices.Application.Helpers;
using ITServices.Application.Interfaces;
using ITServices.Domain.Entities;
using ITServices.Domain.Interfaces;

namespace ITServices.Application.Services;

public class ServiceCategoryService : IServiceCategoryService
{
    private readonly IServiceCategoryRepository _repository;
    private readonly IMapper _mapper;

    public ServiceCategoryService(IServiceCategoryRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<ApiResponse<List<ServiceCategoryResponseDto>>> GetActiveCategoriesAsync()
    {
        var categories = await _repository.GetActiveCategoriesAsync();
        var result = _mapper.Map<List<ServiceCategoryResponseDto>>(categories);
        return ApiResponse<List<ServiceCategoryResponseDto>>.SuccessResponse(result);
    }

    public async Task<ApiResponse<List<ServiceCategoryWithServicesDto>>> GetActiveCategoriesWithServicesAsync()
    {
        var categories = await _repository.GetActiveCategoriesWithServicesAsync();
        var result = _mapper.Map<List<ServiceCategoryWithServicesDto>>(categories);
        return ApiResponse<List<ServiceCategoryWithServicesDto>>.SuccessResponse(result);
    }

    public async Task<ApiResponse<PaginatedResult<ServiceCategoryResponseDto>>> GetAllPaginatedAsync(int page, int pageSize)
    {
        var (items, totalCount) = await _repository.GetPaginatedAsync(null, page, pageSize, x => x.DisplayOrder);
        var mapped = _mapper.Map<IEnumerable<ServiceCategoryResponseDto>>(items);
        var result = new PaginatedResult<ServiceCategoryResponseDto>
        {
            Items = mapped,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
        return ApiResponse<PaginatedResult<ServiceCategoryResponseDto>>.SuccessResponse(result);
    }

    public async Task<ApiResponse<ServiceCategoryResponseDto>> GetByIdAsync(Guid id)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity == null)
            return ApiResponse<ServiceCategoryResponseDto>.FailResponse("Service category not found.");

        var result = _mapper.Map<ServiceCategoryResponseDto>(entity);
        return ApiResponse<ServiceCategoryResponseDto>.SuccessResponse(result);
    }

    public async Task<ApiResponse<ServiceCategoryResponseDto>> CreateAsync(CreateServiceCategoryRequestDto request)
    {
        var entity = _mapper.Map<ServiceCategory>(request);
        entity.Id = Guid.NewGuid();
        entity.Slug = string.IsNullOrWhiteSpace(request.Slug) ? SlugHelper.GenerateSlug(request.Name) : request.Slug;
        entity.CreatedAt = DateTime.UtcNow;
        entity.UpdatedAt = DateTime.UtcNow;

        await _repository.AddAsync(entity);
        var result = _mapper.Map<ServiceCategoryResponseDto>(entity);
        return ApiResponse<ServiceCategoryResponseDto>.SuccessResponse(result, "Service category created successfully.");
    }

    public async Task<ApiResponse<ServiceCategoryResponseDto>> UpdateAsync(Guid id, UpdateServiceCategoryRequestDto request)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity == null)
            return ApiResponse<ServiceCategoryResponseDto>.FailResponse("Service category not found.");

        entity.Name = request.Name;
        entity.Slug = string.IsNullOrWhiteSpace(request.Slug) ? SlugHelper.GenerateSlug(request.Name) : request.Slug;
        entity.Description = request.Description;
        entity.IconUrl = request.IconUrl;
        entity.DisplayOrder = request.DisplayOrder;
        entity.IsActive = request.IsActive;
        entity.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(entity);
        var result = _mapper.Map<ServiceCategoryResponseDto>(entity);
        return ApiResponse<ServiceCategoryResponseDto>.SuccessResponse(result, "Service category updated successfully.");
    }

    public async Task<ApiResponse<bool>> DeleteAsync(Guid id)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity == null)
            return ApiResponse<bool>.FailResponse("Service category not found.");

        await _repository.DeleteAsync(entity);
        return ApiResponse<bool>.SuccessResponse(true, "Service category deleted successfully.");
    }
}
