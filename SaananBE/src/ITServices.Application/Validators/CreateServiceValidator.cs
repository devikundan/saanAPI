using FluentValidation;
using ITServices.Application.DTOs.Services;

namespace ITServices.Application.Validators;

public class CreateServiceValidator : AbstractValidator<CreateServiceRequestDto>
{
    public CreateServiceValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MinimumLength(3).WithMessage("Title must be at least 3 characters.")
            .MaximumLength(200).WithMessage("Title must not exceed 200 characters.");

        RuleFor(x => x.ShortDescription)
            .NotEmpty().WithMessage("Short description is required.")
            .MinimumLength(10).WithMessage("Short description must be at least 10 characters.")
            .MaximumLength(500).WithMessage("Short description must not exceed 500 characters.");

        RuleFor(x => x.ServiceCategoryId)
            .NotEmpty().WithMessage("Service category is required.");
    }
}
