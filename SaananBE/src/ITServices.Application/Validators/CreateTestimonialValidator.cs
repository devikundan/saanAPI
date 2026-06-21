using FluentValidation;
using ITServices.Application.DTOs.Testimonials;

namespace ITServices.Application.Validators;

public class CreateTestimonialValidator : AbstractValidator<CreateTestimonialRequestDto>
{
    public CreateTestimonialValidator()
    {
        RuleFor(x => x.ClientName)
            .NotEmpty().WithMessage("Client name is required.")
            .MinimumLength(2).WithMessage("Client name must be at least 2 characters.")
            .MaximumLength(150).WithMessage("Client name must not exceed 150 characters.");

        RuleFor(x => x.Content)
            .NotEmpty().WithMessage("Content is required.")
            .MinimumLength(10).WithMessage("Content must be at least 10 characters.")
            .MaximumLength(1000).WithMessage("Content must not exceed 1000 characters.");

        RuleFor(x => x.Rating)
            .InclusiveBetween(1, 5).WithMessage("Rating must be between 1 and 5.");
    }
}
