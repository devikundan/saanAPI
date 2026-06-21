using ITServices.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ITServices.Infrastructure.Data.Configurations;

public class QueryClassificationConfiguration : IEntityTypeConfiguration<QueryClassification>
{
    public void Configure(EntityTypeBuilder<QueryClassification> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.OriginalQuery)
            .IsRequired()
            .HasMaxLength(2000);

        builder.Property(x => x.ClassifiedCategory)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(x => x.SuggestedServiceSlug)
            .HasMaxLength(250);

        builder.Property(x => x.AiResponse)
            .HasColumnType("nvarchar(max)");

        builder.HasOne(x => x.Lead)
            .WithMany()
            .HasForeignKey(x => x.LeadId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(x => x.ContactMessage)
            .WithMany()
            .HasForeignKey(x => x.ContactMessageId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
