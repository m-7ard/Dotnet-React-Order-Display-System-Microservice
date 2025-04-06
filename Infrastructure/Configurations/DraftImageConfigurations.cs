using Infrastructure.DbEntities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations;

public class DraftImageConfigurations : IEntityTypeConfiguration<DraftImageDbEntity>
{
    public void Configure(EntityTypeBuilder<DraftImageDbEntity> builder) {}
}