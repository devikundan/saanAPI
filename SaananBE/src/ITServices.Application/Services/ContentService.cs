using AutoMapper;
using ITServices.Application.DTOs.Common;
using ITServices.Application.DTOs.Content;
using ITServices.Application.Interfaces;
using ITServices.Domain.Interfaces;

namespace ITServices.Application.Services;

public class ContentService : IContentService
{
    private readonly IContentRepository _repository;
    private readonly IMapper _mapper;

    public ContentService(IContentRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<ApiResponse<ContentResponseDto>> GetBySectionKeyAsync(string sectionKey)
    {
        var entity = await _repository.GetBySectionKeyAsync(sectionKey);
        if (entity == null)
            return ApiResponse<ContentResponseDto>.FailResponse("Content section not found.");

        var result = _mapper.Map<ContentResponseDto>(entity);
        return ApiResponse<ContentResponseDto>.SuccessResponse(result);
    }

    public async Task<ApiResponse<List<ContentResponseDto>>> GetAllSectionsAsync()
    {
        var sections = await _repository.GetAllSectionsAsync();
        var result = _mapper.Map<List<ContentResponseDto>>(sections);
        return ApiResponse<List<ContentResponseDto>>.SuccessResponse(result);
    }

    public async Task<ApiResponse<ContentResponseDto>> UpdateAsync(Guid id, UpdateContentRequestDto request)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity == null)
            return ApiResponse<ContentResponseDto>.FailResponse("Content section not found.");

        entity.Title = request.Title;
        entity.Body = request.Body;
        entity.ImageUrl = request.ImageUrl;
        entity.MetaData = request.MetaData;
        entity.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(entity);
        var result = _mapper.Map<ContentResponseDto>(entity);
        return ApiResponse<ContentResponseDto>.SuccessResponse(result, "Content section updated successfully.");
    }
}
