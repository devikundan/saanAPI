using AutoMapper;
using ITServices.Application.DTOs.Common;
using ITServices.Application.DTOs.Services;
using ITServices.Application.Helpers;
using ITServices.Application.Interfaces;
using ITServices.Domain.Entities;
using ITServices.Domain.Interfaces;

namespace ITServices.Application.Services;

public class ServiceService : IServiceService
{
    private readonly IServiceRepository _repository;
    private readonly IMapper _mapper;

    public ServiceService(IServiceRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<ApiResponse<List<ServiceResponseDto>>> GetActiveServicesAsync()
    {
        var services = await _repository.GetActiveServicesAsync();
        var result = _mapper.Map<List<ServiceResponseDto>>(services);
        return ApiResponse<List<ServiceResponseDto>>.SuccessResponse(result);
    }

    public async Task<ApiResponse<ServiceResponseDto>> GetBySlugAsync(string slug)
    {
        var service = await _repository.GetBySlugAsync(slug);
        if (service == null)
            return ApiResponse<ServiceResponseDto>.FailResponse("Service not found.");

        var result = _mapper.Map<ServiceResponseDto>(service);
        return ApiResponse<ServiceResponseDto>.SuccessResponse(result);
    }

    public async Task<ApiResponse<PaginatedResult<ServiceResponseDto>>> GetAllPaginatedAsync(int page, int pageSize)
    {
        var (items, totalCount) = await _repository.GetPaginatedAsync(null, page, pageSize, x => x.DisplayOrder);
        var mapped = _mapper.Map<IEnumerable<ServiceResponseDto>>(items);
        var result = new PaginatedResult<ServiceResponseDto>
        {
            Items = mapped,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
        return ApiResponse<PaginatedResult<ServiceResponseDto>>.SuccessResponse(result);
    }

    public async Task<ApiResponse<ServiceResponseDto>> GetByIdAsync(Guid id)
    {
        var service = await _repository.GetByIdWithCategoryAsync(id);
        if (service == null)
            return ApiResponse<ServiceResponseDto>.FailResponse("Service not found.");

        var result = _mapper.Map<ServiceResponseDto>(service);
        return ApiResponse<ServiceResponseDto>.SuccessResponse(result);
    }

    public async Task<ApiResponse<ServiceResponseDto>> CreateAsync(CreateServiceRequestDto request)
    {
        var entity = _mapper.Map<Service>(request);
        entity.Id = Guid.NewGuid();
        entity.Slug = !string.IsNullOrWhiteSpace(request.Slug)
            ? request.Slug
            : SlugHelper.GenerateSlug(request.Title);
        entity.CreatedAt = DateTime.UtcNow;
        entity.UpdatedAt = DateTime.UtcNow;

        await _repository.AddAsync(entity);

        var created = await _repository.GetByIdWithCategoryAsync(entity.Id);
        var result = _mapper.Map<ServiceResponseDto>(created);
        return ApiResponse<ServiceResponseDto>.SuccessResponse(result, "Service created successfully.");
    }

    public async Task<ApiResponse<ServiceResponseDto>> UpdateAsync(Guid id, UpdateServiceRequestDto request)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity == null)
            return ApiResponse<ServiceResponseDto>.FailResponse("Service not found.");

        entity.Title = request.Title;
        entity.Slug = !string.IsNullOrWhiteSpace(request.Slug)
            ? request.Slug
            : SlugHelper.GenerateSlug(request.Title);
        entity.ShortDescription = request.ShortDescription;
        entity.DetailedDescription = request.DetailedDescription;
        entity.IconUrl = request.IconUrl ?? string.Empty;
        entity.ServiceCategoryId = request.ServiceCategoryId;
        entity.DisplayOrder = request.DisplayOrder;
        entity.IsActive = request.IsActive;
        entity.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(entity);

        var updated = await _repository.GetByIdWithCategoryAsync(entity.Id);
        var result = _mapper.Map<ServiceResponseDto>(updated);
        return ApiResponse<ServiceResponseDto>.SuccessResponse(result, "Service updated successfully.");
    }

    public async Task<ApiResponse<bool>> DeleteAsync(Guid id)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity == null)
            return ApiResponse<bool>.FailResponse("Service not found.");

        await _repository.DeleteAsync(entity);
        return ApiResponse<bool>.SuccessResponse(true, "Service deleted successfully.");
    }
}
