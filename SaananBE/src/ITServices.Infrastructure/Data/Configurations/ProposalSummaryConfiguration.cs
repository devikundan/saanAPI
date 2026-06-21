using ITServices.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ITServices.Infrastructure.Data.Configurations;

public class ProposalSummaryConfiguration : IEntityTypeConfiguration<ProposalSummary>
{
    public void Configure(EntityTypeBuilder<ProposalSummary> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.ClientName)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(x => x.ProjectScope)
            .IsRequired()
            .HasColumnType("nvarchar(max)");

        builder.Property(x => x.GeneratedSummary)
            .IsRequired()
            .HasColumnType("nvarchar(max)");

        builder.Property(x => x.EstimatedTimeline)
            .HasMaxLength(200);

        builder.Property(x => x.EstimatedBudgetRange)
            .HasMaxLength(200);

        builder.Property(x => x.RecommendedServices)
            .HasMaxLength(500);

        builder.Property(x => x.TechStack)
            .HasMaxLength(500);

        builder.HasOne(x => x.Lead)
            .WithMany()
            .HasForeignKey(x => x.LeadId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
