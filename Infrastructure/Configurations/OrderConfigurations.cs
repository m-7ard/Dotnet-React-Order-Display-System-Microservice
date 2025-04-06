using Infrastructure.DbEntities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations;

public class OrderConfigurations : IEntityTypeConfiguration<OrderDbEntity>
{
    public void Configure(EntityTypeBuilder<OrderDbEntity> builder)
    {
        builder.HasKey(d => d.Id);

        builder.Property(d => d.Id)
            .ValueGeneratedNever();
        
        // builder.Property(e => e.SerialNumber)
        //     .ValueGeneratedOnAdd()
        //     .HasDefaultValueSql("NEXT VALUE FOR OrderItemSerialNumberSequence");

        builder.Property(d => d.Total)
            .HasPrecision(18, 2);
    }
}