using ITServices.Application.DTOs.Common;
using ITServices.Application.DTOs.QueryClassification;

namespace ITServices.Application.Interfaces;

public interface IQueryClassificationService
{
    Task<ApiResponse<QueryClassificationResponseDto>> ClassifyQueryAsync(ClassifyQueryRequestDto request);
    Task<ApiResponse<List<QueryClassificationResponseDto>>> GetRecentClassificationsAsync(int count = 20);
    Task<ApiResponse<QueryClassificationResponseDto>> GetByIdAsync(Guid id);
}
