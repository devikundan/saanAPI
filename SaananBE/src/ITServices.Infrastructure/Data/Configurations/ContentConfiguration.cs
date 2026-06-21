using ITServices.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ITServices.Infrastructure.Data.Configurations;

public class ContentConfiguration : IEntityTypeConfiguration<Content>
{
    public void Configure(EntityTypeBuilder<Content> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.SectionKey)
            .IsRequired()
            .HasMaxLength(100);

        builder.HasIndex(x => x.SectionKey).IsUnique();

        builder.Property(x => x.Title)
            .IsRequired()
            .HasMaxLength(300);

        builder.Property(x => x.Body)
            .HasColumnType("nvarchar(max)");

        builder.Property(x => x.ImageUrl)
            .HasMaxLength(500);

        builder.Property(x => x.MetaData)
            .HasColumnType("nvarchar(max)");
    }
}
