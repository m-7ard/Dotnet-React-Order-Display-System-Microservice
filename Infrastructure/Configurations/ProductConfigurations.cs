using Infrastructure.DbEntities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations;

public class ProductConfigurations : IEntityTypeConfiguration<ProductDbEntity>
{
    public void Configure(EntityTypeBuilder<ProductDbEntity> builder)
    {
        builder.HasKey(d => d.Id);

        builder.Property(d => d.Id)
            .ValueGeneratedNever();
            
        builder.Property(d => d.Name)
            .HasMaxLength(255)
            .IsRequired();
            
        builder.Property(d => d.Description)
            .HasMaxLength(1028)
            .IsRequired();

        builder.Property(d => d.Price)
            .HasPrecision(18, 2);
    }
}