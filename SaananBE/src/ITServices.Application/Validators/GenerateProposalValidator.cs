using FluentValidation;
using ITServices.Application.DTOs.ProposalSummary;

namespace ITServices.Application.Validators;

public class GenerateProposalValidator : AbstractValidator<GenerateProposalRequestDto>
{
    public GenerateProposalValidator()
    {
        RuleFor(x => x.LeadId)
            .NotEmpty().WithMessage("Lead ID is required.");

        RuleFor(x => x.ClientName)
            .NotEmpty().WithMessage("Client name is required.")
            .MaximumLength(150).WithMessage("Client name must not exceed 150 characters.");

        RuleFor(x => x.ProjectScope)
            .NotEmpty().WithMessage("Project scope is required.")
            .MinimumLength(20).WithMessage("Project scope must be at least 20 characters.")
            .MaximumLength(5000).WithMessage("Project scope must not exceed 5000 characters.");
    }
}
