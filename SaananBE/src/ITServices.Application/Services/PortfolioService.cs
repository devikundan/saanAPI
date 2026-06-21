using AutoMapper;
using ITServices.Application.DTOs.Common;
using ITServices.Application.DTOs.Portfolio;
using ITServices.Application.Helpers;
using ITServices.Application.Interfaces;
using ITServices.Domain.Entities;
using ITServices.Domain.Interfaces;

namespace ITServices.Application.Services;

public class PortfolioService : IPortfolioService
{
    private readonly IPortfolioRepository _repository;
    private readonly IMapper _mapper;

    public PortfolioService(IPortfolioRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<ApiResponse<List<PortfolioResponseDto>>> GetActiveProjectsAsync()
    {
        var projects = await _repository.GetActiveProjectsAsync();
        var result = _mapper.Map<List<PortfolioResponseDto>>(projects);
        return ApiResponse<List<PortfolioResponseDto>>.SuccessResponse(result);
    }

    public async Task<ApiResponse<PortfolioResponseDto>> GetBySlugAsync(string slug)
    {
        var project = await _repository.GetBySlugAsync(slug);
        if (project == null)
            return ApiResponse<PortfolioResponseDto>.FailResponse("Project not found.");

        var result = _mapper.Map<PortfolioResponseDto>(project);
        return ApiResponse<PortfolioResponseDto>.SuccessResponse(result);
    }

    public async Task<ApiResponse<PaginatedResult<PortfolioResponseDto>>> GetAllPaginatedAsync(int page, int pageSize)
    {
        var (items, totalCount) = await _repository.GetPaginatedAsync(null, page, pageSize, x => x.DisplayOrder);
        var mapped = _mapper.Map<IEnumerable<PortfolioResponseDto>>(items);
        var result = new PaginatedResult<PortfolioResponseDto>
        {
            Items = mapped,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
        return ApiResponse<PaginatedResult<PortfolioResponseDto>>.SuccessResponse(result);
    }

    public async Task<ApiResponse<PortfolioResponseDto>> GetByIdAsync(Guid id)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity == null)
            return ApiResponse<PortfolioResponseDto>.FailResponse("Project not found.");

        var result = _mapper.Map<PortfolioResponseDto>(entity);
        return ApiResponse<PortfolioResponseDto>.SuccessResponse(result);
    }

    public async Task<ApiResponse<PortfolioResponseDto>> CreateAsync(CreatePortfolioRequestDto request)
    {
        var entity = _mapper.Map<PortfolioProject>(request);
        entity.Id = Guid.NewGuid();
        entity.Slug = !string.IsNullOrWhiteSpace(request.Slug)
            ? request.Slug
            : SlugHelper.GenerateSlug(request.Title);
        entity.CreatedAt = DateTime.UtcNow;
        entity.UpdatedAt = DateTime.UtcNow;

        await _repository.AddAsync(entity);
        var result = _mapper.Map<PortfolioResponseDto>(entity);
        return ApiResponse<PortfolioResponseDto>.SuccessResponse(result, "Project created successfully.");
    }

    public async Task<ApiResponse<PortfolioResponseDto>> UpdateAsync(Guid id, UpdatePortfolioRequestDto request)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity == null)
            return ApiResponse<PortfolioResponseDto>.FailResponse("Project not found.");

        entity.Title = request.Title;
        entity.Slug = !string.IsNullOrWhiteSpace(request.Slug)
            ? request.Slug
            : SlugHelper.GenerateSlug(request.Title);
        entity.Description = request.Description;
        entity.ClientName = request.ClientName;
        entity.ProjectUrl = request.ProjectUrl;
        entity.ThumbnailUrl = request.ThumbnailUrl;
        entity.Technologies = request.Technologies;
        entity.CompletedAt = request.CompletedAt;
        entity.DisplayOrder = request.DisplayOrder;
        entity.IsActive = request.IsActive;
        entity.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(entity);
        var result = _mapper.Map<PortfolioResponseDto>(entity);
        return ApiResponse<PortfolioResponseDto>.SuccessResponse(result, "Project updated successfully.");
    }

    public async Task<ApiResponse<bool>> DeleteAsync(Guid id)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity == null)
            return ApiResponse<bool>.FailResponse("Project not found.");

        await _repository.DeleteAsync(entity);
        return ApiResponse<bool>.SuccessResponse(true, "Project deleted successfully.");
    }
}
