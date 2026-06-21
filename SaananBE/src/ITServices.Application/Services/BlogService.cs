using AutoMapper;
using ITServices.Application.DTOs.Blogs;
using ITServices.Application.DTOs.Common;
using ITServices.Application.Helpers;
using ITServices.Application.Interfaces;
using ITServices.Domain.Entities;
using ITServices.Domain.Enums;
using ITServices.Domain.Interfaces;

namespace ITServices.Application.Services;

public class BlogService : IBlogService
{
    private readonly IBlogRepository _repository;
    private readonly IMapper _mapper;

    public BlogService(IBlogRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<ApiResponse<PaginatedResult<BlogListResponseDto>>> GetPublishedBlogsAsync(int page, int pageSize)
    {
        var (items, totalCount) = await _repository.GetPublishedBlogsAsync(page, pageSize);
        var mapped = _mapper.Map<IEnumerable<BlogListResponseDto>>(items);
        var result = new PaginatedResult<BlogListResponseDto>
        {
            Items = mapped,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
        return ApiResponse<PaginatedResult<BlogListResponseDto>>.SuccessResponse(result);
    }

    public async Task<ApiResponse<BlogResponseDto>> GetBySlugAsync(string slug)
    {
        var blog = await _repository.GetBySlugAsync(slug);
        if (blog == null || blog.Status != BlogStatus.Published)
            return ApiResponse<BlogResponseDto>.FailResponse("Blog post not found.");

        var result = _mapper.Map<BlogResponseDto>(blog);
        return ApiResponse<BlogResponseDto>.SuccessResponse(result);
    }

    public async Task<ApiResponse<PaginatedResult<BlogResponseDto>>> GetAllPaginatedAsync(int page, int pageSize)
    {
        var (items, totalCount) = await _repository.GetPaginatedAsync(null, page, pageSize, x => x.CreatedAt, ascending: false);
        var mapped = _mapper.Map<IEnumerable<BlogResponseDto>>(items);
        var result = new PaginatedResult<BlogResponseDto>
        {
            Items = mapped,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
        return ApiResponse<PaginatedResult<BlogResponseDto>>.SuccessResponse(result);
    }

    public async Task<ApiResponse<BlogResponseDto>> GetByIdAsync(Guid id)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity == null)
            return ApiResponse<BlogResponseDto>.FailResponse("Blog post not found.");

        var result = _mapper.Map<BlogResponseDto>(entity);
        return ApiResponse<BlogResponseDto>.SuccessResponse(result);
    }

    public async Task<ApiResponse<BlogResponseDto>> CreateAsync(CreateBlogRequestDto request)
    {
        var entity = _mapper.Map<Blog>(request);
        entity.Id = Guid.NewGuid();
        entity.Slug = !string.IsNullOrWhiteSpace(request.Slug)
            ? request.Slug
            : SlugHelper.GenerateSlug(request.Title);
        entity.CreatedAt = DateTime.UtcNow;
        entity.UpdatedAt = DateTime.UtcNow;

        if (request.Status == BlogStatus.Published)
            entity.PublishedAt = DateTime.UtcNow;

        await _repository.AddAsync(entity);
        var result = _mapper.Map<BlogResponseDto>(entity);
        return ApiResponse<BlogResponseDto>.SuccessResponse(result, "Blog post created successfully.");
    }

    public async Task<ApiResponse<BlogResponseDto>> UpdateAsync(Guid id, UpdateBlogRequestDto request)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity == null)
            return ApiResponse<BlogResponseDto>.FailResponse("Blog post not found.");

        var wasPublished = entity.Status == BlogStatus.Published;

        entity.Title = request.Title;
        entity.Slug = !string.IsNullOrWhiteSpace(request.Slug)
            ? request.Slug
            : SlugHelper.GenerateSlug(request.Title);
        entity.Summary = request.Summary;
        entity.Content = request.Content;
        entity.FeaturedImageUrl = request.FeaturedImageUrl;
        entity.Author = request.Author;
        entity.Tags = request.Tags;
        entity.Status = request.Status;
        entity.UpdatedAt = DateTime.UtcNow;

        if (!wasPublished && request.Status == BlogStatus.Published)
            entity.PublishedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(entity);
        var result = _mapper.Map<BlogResponseDto>(entity);
        return ApiResponse<BlogResponseDto>.SuccessResponse(result, "Blog post updated successfully.");
    }

    public async Task<ApiResponse<bool>> DeleteAsync(Guid id)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity == null)
            return ApiResponse<bool>.FailResponse("Blog post not found.");

        await _repository.DeleteAsync(entity);
        return ApiResponse<bool>.SuccessResponse(true, "Blog post deleted successfully.");
    }
}
