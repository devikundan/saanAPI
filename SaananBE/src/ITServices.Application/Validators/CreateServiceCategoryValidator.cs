using FluentValidation;
using ITServices.Application.DTOs.ServiceCategories;

namespace ITServices.Application.Validators;

public class CreateServiceCategoryValidator : AbstractValidator<CreateServiceCategoryRequestDto>
{
    public CreateServiceCategoryValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Category name is required.")
            .MinimumLength(2).WithMessage("Category name must be at least 2 characters.")
            .MaximumLength(150).WithMessage("Category name must not exceed 150 characters.");
    }
}
