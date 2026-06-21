using AutoMapper;
using ITServices.Application.DTOs.Common;
using ITServices.Application.DTOs.Newsletter;
using ITServices.Application.Interfaces;
using ITServices.Domain.Entities;
using ITServices.Domain.Interfaces;

namespace ITServices.Application.Services;

public class NewsletterService : INewsletterService
{
    private readonly INewsletterSubscriberRepository _repository;
    private readonly IMapper _mapper;

    public NewsletterService(INewsletterSubscriberRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<ApiResponse<NewsletterConfirmationDto>> SubscribeAsync(NewsletterSubscribeRequestDto request)
    {
        var existing = await _repository.GetByEmailAsync(request.Email.ToLowerInvariant());

        if (existing != null)
        {
            if (existing.IsActive)
                return ApiResponse<NewsletterConfirmationDto>.FailResponse("Email is already subscribed.");

            // Reactivate subscription
            existing.IsActive = true;
            existing.UnsubscribedAt = null;
            existing.Name = request.Name ?? existing.Name;
            await _repository.UpdateAsync(existing);

            return ApiResponse<NewsletterConfirmationDto>.SuccessResponse(
                new NewsletterConfirmationDto(), "Successfully re-subscribed to the newsletter.");
        }

        var entity = new NewsletterSubscriber
        {
            Id = Guid.NewGuid(),
            Email = request.Email.ToLowerInvariant(),
            Name = request.Name,
            IsActive = true,
            SubscribedAt = DateTime.UtcNow
        };

        await _repository.AddAsync(entity);
        return ApiResponse<NewsletterConfirmationDto>.SuccessResponse(new NewsletterConfirmationDto());
    }

    public async Task<ApiResponse<bool>> UnsubscribeAsync(string email)
    {
        var subscriber = await _repository.GetByEmailAsync(email.ToLowerInvariant());
        if (subscriber == null || !subscriber.IsActive)
            return ApiResponse<bool>.FailResponse("Email is not subscribed.");

        subscriber.IsActive = false;
        subscriber.UnsubscribedAt = DateTime.UtcNow;
        await _repository.UpdateAsync(subscriber);

        return ApiResponse<bool>.SuccessResponse(true, "Successfully unsubscribed.");
    }

    public async Task<ApiResponse<PaginatedResult<NewsletterSubscriberResponseDto>>> GetAllSubscribersAsync(int page, int pageSize)
    {
        var (items, totalCount) = await _repository.GetPaginatedAsync(null, page, pageSize, x => x.SubscribedAt, ascending: false);
        var mapped = _mapper.Map<IEnumerable<NewsletterSubscriberResponseDto>>(items);
        var result = new PaginatedResult<NewsletterSubscriberResponseDto>
        {
            Items = mapped,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
        return ApiResponse<PaginatedResult<NewsletterSubscriberResponseDto>>.SuccessResponse(result);
    }

    public async Task<ApiResponse<bool>> DeleteSubscriberAsync(Guid id)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity == null)
            return ApiResponse<bool>.FailResponse("Subscriber not found.");

        await _repository.DeleteAsync(entity);
        return ApiResponse<bool>.SuccessResponse(true, "Subscriber deleted successfully.");
    }
}
