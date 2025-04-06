using Infrastructure.DbEntities;
using Microsoft.EntityFrameworkCore;


namespace Infrastructure;

public class SimpleProductOrderServiceDbContext : DbContext
{
    public SimpleProductOrderServiceDbContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<ProductDbEntity> Product { get; set; } = null!;
    public DbSet<ProductHistoryDbEntity> ProductHistory { get; set; } = null!;
    public DbSet<ProductImageDbEntity> ProductImage { get; set; } = null!;
    public DbSet<OrderDbEntity> Order { get; set; } = null!;
    public DbSet<OrderItemDbEntity> OrderItem { get; set; } = null!;
    public DbSet<DraftImageDbEntity> DraftImage { get; set; } = null!;
    public DbSet<SequenceDbEntity> Sequence { get; set; } = null!;

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            throw new InvalidOperationException("Database provider not configured.");
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // [[[Mssql only]]]
        // // Required for SerialNumber to work as a non-pk auto-incrementing field
        // modelBuilder.HasSequence<int>("OrderSerialNumberSequence");
        // modelBuilder.HasSequence<int>("OrderItemSerialNumberSequence");

        // configs
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(SimpleProductOrderServiceDbContext).Assembly);
    }
}