using FluentValidation;
using ITServices.Application.DTOs.Newsletter;

namespace ITServices.Application.Validators;

public class NewsletterSubscribeValidator : AbstractValidator<NewsletterSubscribeRequestDto>
{
    public NewsletterSubscribeValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("A valid email address is required.")
            .MaximumLength(250).WithMessage("Email must not exceed 250 characters.");

        RuleFor(x => x.Name)
            .MaximumLength(150).WithMessage("Name must not exceed 150 characters.")
            .When(x => !string.IsNullOrEmpty(x.Name));
    }
}
