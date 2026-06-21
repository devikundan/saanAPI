using FluentValidation;
using ITServices.Application.DTOs.QueryClassification;

namespace ITServices.Application.Validators;

public class ClassifyQueryValidator : AbstractValidator<ClassifyQueryRequestDto>
{
    public ClassifyQueryValidator()
    {
        RuleFor(x => x.Query)
            .NotEmpty().WithMessage("Query text is required.")
            .MinimumLength(5).WithMessage("Query must be at least 5 characters.")
            .MaximumLength(2000).WithMessage("Query must not exceed 2000 characters.");
    }
}
