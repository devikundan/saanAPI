using FluentValidation;
using ITServices.Application.DTOs.Faqs;

namespace ITServices.Application.Validators;

public class CreateFaqValidator : AbstractValidator<CreateFaqRequestDto>
{
    public CreateFaqValidator()
    {
        RuleFor(x => x.Question)
            .NotEmpty().WithMessage("Question is required.")
            .MinimumLength(10).WithMessage("Question must be at least 10 characters.")
            .MaximumLength(500).WithMessage("Question must not exceed 500 characters.");

        RuleFor(x => x.Answer)
            .NotEmpty().WithMessage("Answer is required.")
            .MinimumLength(10).WithMessage("Answer must be at least 10 characters.")
            .MaximumLength(2000).WithMessage("Answer must not exceed 2000 characters.");
    }
}
