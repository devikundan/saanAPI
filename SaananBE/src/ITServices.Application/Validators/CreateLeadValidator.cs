using FluentValidation;
using ITServices.Application.DTOs.Leads;

namespace ITServices.Application.Validators;

public class CreateLeadValidator : AbstractValidator<CreateLeadRequestDto>
{
    public CreateLeadValidator()
    {
        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Full name is required.")
            .MinimumLength(2).WithMessage("Full name must be at least 2 characters.")
            .MaximumLength(150).WithMessage("Full name must not exceed 150 characters.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("A valid email address is required.")
            .MaximumLength(250).WithMessage("Email must not exceed 250 characters.");

        RuleFor(x => x.Phone)
            .MaximumLength(20).WithMessage("Phone must not exceed 20 characters.")
            .Matches(@"^\+?[\d\s\-()]+$").WithMessage("Phone number format is invalid.")
            .When(x => !string.IsNullOrEmpty(x.Phone));

        RuleFor(x => x.Message)
            .NotEmpty().WithMessage("Message is required.")
            .MinimumLength(10).WithMessage("Message must be at least 10 characters.")
            .MaximumLength(2000).WithMessage("Message must not exceed 2000 characters.");
    }
}
