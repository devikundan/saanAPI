using ITServices.Application.DTOs.Common;
using ITServices.Application.DTOs.ContactMessages;

namespace ITServices.Application.Interfaces;

public interface IContactMessageService
{
    Task<ApiResponse<ContactMessageConfirmationDto>> CreateAsync(CreateContactMessageRequestDto request);
    Task<ApiResponse<PaginatedResult<ContactMessageResponseDto>>> GetAllPaginatedAsync(int page, int pageSize);
    Task<ApiResponse<ContactMessageResponseDto>> GetByIdAsync(Guid id);
    Task<ApiResponse<ContactMessageResponseDto>> MarkAsReadAsync(Guid id);
    Task<ApiResponse<bool>> DeleteAsync(Guid id);
}
