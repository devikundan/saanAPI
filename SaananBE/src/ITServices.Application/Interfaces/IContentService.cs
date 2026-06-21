using ITServices.Application.DTOs.Common;
using ITServices.Application.DTOs.Content;

namespace ITServices.Application.Interfaces;

public interface IContentService
{
    Task<ApiResponse<ContentResponseDto>> GetBySectionKeyAsync(string sectionKey);
    Task<ApiResponse<List<ContentResponseDto>>> GetAllSectionsAsync();
    Task<ApiResponse<ContentResponseDto>> UpdateAsync(Guid id, UpdateContentRequestDto request);
}
