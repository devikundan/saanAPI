using FluentValidation;
using ITServices.Application.DTOs.Portfolio;

namespace ITServices.Application.Validators;

public class CreatePortfolioValidator : AbstractValidator<CreatePortfolioRequestDto>
{
    public CreatePortfolioValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MinimumLength(3).WithMessage("Title must be at least 3 characters.")
            .MaximumLength(200).WithMessage("Title must not exceed 200 characters.");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required.")
            .MinimumLength(20).WithMessage("Description must be at least 20 characters.");
    }
}
