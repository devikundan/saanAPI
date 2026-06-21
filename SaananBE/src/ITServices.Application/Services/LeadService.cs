using AutoMapper;
using ITServices.Application.DTOs.Common;
using ITServices.Application.DTOs.Leads;
using ITServices.Application.Interfaces;
using ITServices.Domain.Entities;
using ITServices.Domain.Interfaces;

namespace ITServices.Application.Services;

public class LeadService : ILeadService
{
    private readonly ILeadRepository _repository;
    private readonly IMapper _mapper;
    private readonly IEmailService _emailService;

    public LeadService(ILeadRepository repository, IMapper mapper, IEmailService emailService)
    {
        _repository = repository;
        _mapper = mapper;
        _emailService = emailService;
    }

    public async Task<ApiResponse<LeadConfirmationDto>> CreateAsync(CreateLeadRequestDto request)
    {
        var entity = _mapper.Map<Lead>(request);
        entity.Id = Guid.NewGuid();
        entity.CreatedAt = DateTime.UtcNow;
        entity.UpdatedAt = DateTime.UtcNow;

        await _repository.AddAsync(entity);

        // Send notification email to admin (fire-and-forget)
        _ = _emailService.SendLeadNotificationAsync(request.FullName, request.Email, request.Message);

        var confirmation = new LeadConfirmationDto { Id = entity.Id };
        return ApiResponse<LeadConfirmationDto>.SuccessResponse(confirmation, "Lead submitted successfully.");
    }

    public async Task<ApiResponse<PaginatedResult<LeadResponseDto>>> GetAllPaginatedAsync(int page, int pageSize)
    {
        var (items, totalCount) = await _repository.GetPaginatedAsync(null, page, pageSize, x => x.CreatedAt, ascending: false);
        var mapped = _mapper.Map<IEnumerable<LeadResponseDto>>(items);
        var result = new PaginatedResult<LeadResponseDto>
        {
            Items = mapped,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
        return ApiResponse<PaginatedResult<LeadResponseDto>>.SuccessResponse(result);
    }

    public async Task<ApiResponse<LeadResponseDto>> GetByIdAsync(Guid id)
    {
        var entity = await _repository.GetByIdWithServiceAsync(id);
        if (entity == null)
            return ApiResponse<LeadResponseDto>.FailResponse("Lead not found.");

        var result = _mapper.Map<LeadResponseDto>(entity);
        return ApiResponse<LeadResponseDto>.SuccessResponse(result);
    }

    public async Task<ApiResponse<LeadResponseDto>> UpdateStatusAsync(Guid id, UpdateLeadStatusRequestDto request)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity == null)
            return ApiResponse<LeadResponseDto>.FailResponse("Lead not found.");

        entity.Status = request.Status;
        entity.AdminNotes = request.AdminNotes;
        entity.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(entity);

        var updated = await _repository.GetByIdWithServiceAsync(id);
        var result = _mapper.Map<LeadResponseDto>(updated);
        return ApiResponse<LeadResponseDto>.SuccessResponse(result, "Lead status updated successfully.");
    }

    public async Task<ApiResponse<bool>> DeleteAsync(Guid id)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity == null)
            return ApiResponse<bool>.FailResponse("Lead not found.");

        await _repository.DeleteAsync(entity);
        return ApiResponse<bool>.SuccessResponse(true, "Lead deleted successfully.");
    }
}
