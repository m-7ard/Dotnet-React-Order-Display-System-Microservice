using Infrastructure.DbEntities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations;

public class OrderItemConfigurations : IEntityTypeConfiguration<OrderItemDbEntity>
{
    public void Configure(EntityTypeBuilder<OrderItemDbEntity> builder)
    {
        builder.HasKey(d => d.Id);

        builder.Property(d => d.Id)
            .ValueGeneratedNever();

        // builder.Property(e => e.SerialNumber)
        //     .ValueGeneratedOnAdd()
        //     .HasDefaultValueSql("NEXT VALUE FOR OrderSerialNumberSequence");
    }
}