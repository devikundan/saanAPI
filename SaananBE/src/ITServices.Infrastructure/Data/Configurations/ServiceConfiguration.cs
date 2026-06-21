using ITServices.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ITServices.Infrastructure.Data.Configurations;

public class ServiceConfiguration : IEntityTypeConfiguration<Service>
{
    public void Configure(EntityTypeBuilder<Service> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(x => x.Slug)
            .IsRequired()
            .HasMaxLength(250);

        builder.HasIndex(x => x.Slug).IsUnique();

        builder.Property(x => x.ShortDescription)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(x => x.DetailedDescription)
            .HasColumnType("nvarchar(max)");

        builder.Property(x => x.IconUrl)
            .HasMaxLength(500);

        builder.HasOne(x => x.ServiceCategory)
            .WithMany(x => x.Services)
            .HasForeignKey(x => x.ServiceCategoryId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
