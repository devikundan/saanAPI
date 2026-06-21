using ITServices.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ITServices.Infrastructure.Data.Configurations;

public class TestimonialConfiguration : IEntityTypeConfiguration<Testimonial>
{
    public void Configure(EntityTypeBuilder<Testimonial> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.ClientName)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(x => x.ClientTitle)
            .HasMaxLength(200);

        builder.Property(x => x.ClientImageUrl)
            .HasMaxLength(500);

        builder.Property(x => x.Content)
            .IsRequired()
            .HasMaxLength(1000);
    }
}
