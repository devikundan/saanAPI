using ITServices.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ITServices.Infrastructure.Data.Configurations;

public class BlogConfiguration : IEntityTypeConfiguration<Blog>
{
    public void Configure(EntityTypeBuilder<Blog> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Title)
            .IsRequired()
            .HasMaxLength(300);

        builder.Property(x => x.Slug)
            .IsRequired()
            .HasMaxLength(350);

        builder.HasIndex(x => x.Slug).IsUnique();

        builder.Property(x => x.Summary)
            .HasMaxLength(500);

        builder.Property(x => x.Content)
            .IsRequired()
            .HasColumnType("nvarchar(max)");

        builder.Property(x => x.FeaturedImageUrl)
            .HasMaxLength(500);

        builder.Property(x => x.Author)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(x => x.Tags)
            .HasMaxLength(500);

        builder.Property(x => x.Status)
            .HasConversion<int>();
    }
}
