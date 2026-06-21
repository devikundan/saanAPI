using FluentValidation;
using ITServices.Application.DTOs.Blogs;

namespace ITServices.Application.Validators;

public class CreateBlogValidator : AbstractValidator<CreateBlogRequestDto>
{
    public CreateBlogValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MinimumLength(5).WithMessage("Title must be at least 5 characters.")
            .MaximumLength(300).WithMessage("Title must not exceed 300 characters.");

        RuleFor(x => x.Content)
            .NotEmpty().WithMessage("Content is required.")
            .MinimumLength(50).WithMessage("Content must be at least 50 characters.");

        RuleFor(x => x.Author)
            .NotEmpty().WithMessage("Author is required.")
            .MaximumLength(150).WithMessage("Author must not exceed 150 characters.");
    }
}
