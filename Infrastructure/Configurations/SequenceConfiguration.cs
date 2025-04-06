using Infrastructure.DbEntities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations;

public class SequenceConfigurations : IEntityTypeConfiguration<SequenceDbEntity>
{
    public void Configure(EntityTypeBuilder<SequenceDbEntity> builder)
    {
        builder.HasKey(x => x.Id);
        
        // Seed initial sequence
        builder.HasData(new SequenceDbEntity(id: "OrderNumber", currentValue: 0));
        builder.HasData(new SequenceDbEntity(id: "OrderItemNumber", currentValue: 0));
    }
}