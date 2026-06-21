using ITServices.Application.DTOs.Common;
using ITServices.Application.DTOs.Newsletter;

namespace ITServices.Application.Interfaces;

public interface INewsletterService
{
    Task<ApiResponse<NewsletterConfirmationDto>> SubscribeAsync(NewsletterSubscribeRequestDto request);
    Task<ApiResponse<bool>> UnsubscribeAsync(string email);
    Task<ApiResponse<PaginatedResult<NewsletterSubscriberResponseDto>>> GetAllSubscribersAsync(int page, int pageSize);
    Task<ApiResponse<bool>> DeleteSubscriberAsync(Guid id);
}
