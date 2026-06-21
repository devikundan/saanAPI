using AutoMapper;
using ITServices.Application.DTOs.Common;
using ITServices.Application.DTOs.Faqs;
using ITServices.Application.Interfaces;
using ITServices.Domain.Entities;
using ITServices.Domain.Interfaces;

namespace ITServices.Application.Services;

public class FaqService : IFaqService
{
    private readonly IFaqRepository _repository;
    private readonly IMapper _mapper;

    public FaqService(IFaqRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<ApiResponse<List<FaqResponseDto>>> GetActiveFaqsAsync()
    {
        var faqs = await _repository.GetActiveFaqsAsync();
        var result = _mapper.Map<List<FaqResponseDto>>(faqs);
        return ApiResponse<List<FaqResponseDto>>.SuccessResponse(result);
    }

    public async Task<ApiResponse<PaginatedResult<FaqResponseDto>>> GetAllPaginatedAsync(int page, int pageSize)
    {
        var (items, totalCount) = await _repository.GetPaginatedAsync(null, page, pageSize, x => x.DisplayOrder);
        var mapped = _mapper.Map<IEnumerable<FaqResponseDto>>(items);
        var result = new PaginatedResult<FaqResponseDto>
        {
            Items = mapped,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
        return ApiResponse<PaginatedResult<FaqResponseDto>>.SuccessResponse(result);
    }

    public async Task<ApiResponse<FaqResponseDto>> GetByIdAsync(Guid id)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity == null)
            return ApiResponse<FaqResponseDto>.FailResponse("FAQ not found.");

        var result = _mapper.Map<FaqResponseDto>(entity);
        return ApiResponse<FaqResponseDto>.SuccessResponse(result);
    }

    public async Task<ApiResponse<FaqResponseDto>> CreateAsync(CreateFaqRequestDto request)
    {
        var entity = _mapper.Map<Faq>(request);
        entity.Id = Guid.NewGuid();
        entity.CreatedAt = DateTime.UtcNow;
        entity.UpdatedAt = DateTime.UtcNow;

        await _repository.AddAsync(entity);
        var result = _mapper.Map<FaqResponseDto>(entity);
        return ApiResponse<FaqResponseDto>.SuccessResponse(result, "FAQ created successfully.");
    }

    public async Task<ApiResponse<FaqResponseDto>> UpdateAsync(Guid id, UpdateFaqRequestDto request)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity == null)
            return ApiResponse<FaqResponseDto>.FailResponse("FAQ not found.");

        entity.Question = request.Question;
        entity.Answer = request.Answer;
        entity.Category = request.Category;
        entity.DisplayOrder = request.DisplayOrder;
        entity.IsActive = request.IsActive;
        entity.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(entity);
        var result = _mapper.Map<FaqResponseDto>(entity);
        return ApiResponse<FaqResponseDto>.SuccessResponse(result, "FAQ updated successfully.");
    }

    public async Task<ApiResponse<bool>> DeleteAsync(Guid id)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity == null)
            return ApiResponse<bool>.FailResponse("FAQ not found.");

        await _repository.DeleteAsync(entity);
        return ApiResponse<bool>.SuccessResponse(true, "FAQ deleted successfully.");
    }
}
