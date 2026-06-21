using AutoMapper;
using ITServices.Application.DTOs.Common;
using ITServices.Application.DTOs.ContactMessages;
using ITServices.Application.Interfaces;
using ITServices.Domain.Entities;
using ITServices.Domain.Interfaces;

namespace ITServices.Application.Services;

public class ContactMessageService : IContactMessageService
{
    private readonly IContactMessageRepository _repository;
    private readonly IMapper _mapper;
    private readonly IEmailService _emailService;

    public ContactMessageService(IContactMessageRepository repository, IMapper mapper, IEmailService emailService)
    {
        _repository = repository;
        _mapper = mapper;
        _emailService = emailService;
    }

    public async Task<ApiResponse<ContactMessageConfirmationDto>> CreateAsync(CreateContactMessageRequestDto request)
    {
        var entity = _mapper.Map<ContactMessage>(request);
        entity.Id = Guid.NewGuid();
        entity.CreatedAt = DateTime.UtcNow;

        await _repository.AddAsync(entity);

        // Send notification email to admin (fire-and-forget)
        _ = _emailService.SendContactMessageNotificationAsync(request.FullName, request.Email, request.Subject, request.Message);

        var confirmation = new ContactMessageConfirmationDto { Id = entity.Id };
        return ApiResponse<ContactMessageConfirmationDto>.SuccessResponse(confirmation, "Message submitted successfully.");
    }

    public async Task<ApiResponse<PaginatedResult<ContactMessageResponseDto>>> GetAllPaginatedAsync(int page, int pageSize)
    {
        var (items, totalCount) = await _repository.GetPaginatedAsync(null, page, pageSize, x => x.CreatedAt, ascending: false);
        var mapped = _mapper.Map<IEnumerable<ContactMessageResponseDto>>(items);
        var result = new PaginatedResult<ContactMessageResponseDto>
        {
            Items = mapped,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
        return ApiResponse<PaginatedResult<ContactMessageResponseDto>>.SuccessResponse(result);
    }

    public async Task<ApiResponse<ContactMessageResponseDto>> GetByIdAsync(Guid id)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity == null)
            return ApiResponse<ContactMessageResponseDto>.FailResponse("Contact message not found.");

        var result = _mapper.Map<ContactMessageResponseDto>(entity);
        return ApiResponse<ContactMessageResponseDto>.SuccessResponse(result);
    }

    public async Task<ApiResponse<ContactMessageResponseDto>> MarkAsReadAsync(Guid id)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity == null)
            return ApiResponse<ContactMessageResponseDto>.FailResponse("Contact message not found.");

        entity.IsRead = true;
        await _repository.UpdateAsync(entity);

        var result = _mapper.Map<ContactMessageResponseDto>(entity);
        return ApiResponse<ContactMessageResponseDto>.SuccessResponse(result, "Message marked as read.");
    }

    public async Task<ApiResponse<bool>> DeleteAsync(Guid id)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity == null)
            return ApiResponse<bool>.FailResponse("Contact message not found.");

        await _repository.DeleteAsync(entity);
        return ApiResponse<bool>.SuccessResponse(true, "Contact message deleted successfully.");
    }
}
