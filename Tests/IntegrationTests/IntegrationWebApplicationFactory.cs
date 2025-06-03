using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Infrastructure;
using Infrastructure.Interfaces;
using Api.Services;

namespace Tests.IntegrationTests;

public class IntegrationWebApplicationFactory<TProgram> : WebApplicationFactory<TProgram> where TProgram : class
{
    private static SecretsStore? _persistentSecretsStore;
    private static readonly object _lock = new object();
    
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // Remove development database service config
            var dbContextDescriptor = services.SingleOrDefault(d =>
                d.ServiceType == typeof(DbContextOptions<SimpleProductOrderServiceDbContext>));
            if (dbContextDescriptor != null)
            {
                services.Remove(dbContextDescriptor);
            }

            var dbProviderDescriptor = services.SingleOrDefault(d =>
                d.ServiceType == typeof(IDatabaseProviderSingleton));
            if (dbProviderDescriptor != null)
            {
                services.Remove(dbProviderDescriptor);
            }

            var tenantFactoryDescriptor = services.SingleOrDefault(d =>
                d.ServiceType == typeof(TenantDbContextFactory));
            if (tenantFactoryDescriptor != null)
            {
                services.Remove(tenantFactoryDescriptor);
            }

            // Add HttpContextAccessor
            services.AddHttpContextAccessor();

            var configuration = services.BuildServiceProvider().GetRequiredService<IConfiguration>();
            var appSettings = BuilderUtils.ReadTestAppSettings(configuration);
            var databaseProviderSingleton = new DatabaseProviderSingleton(
                value: appSettings.DatabaseProviderValue,
                connectionString: appSettings.ConnectionString,
                isTesting: true);

            // Register singleton provider
            services.AddSingleton<IDatabaseProviderSingleton>(databaseProviderSingleton);

            // Register TenantDatabaseService
            services.AddSingleton<TenantDatabaseService>();

            lock (_lock)
            {
                if (_persistentSecretsStore == null)
                {
                    // Initialize SecretsStore only once
                    _persistentSecretsStore = new SecretsStore();
                }

                // Remove any existing SecretsStore registration and add our persistent one
                var secretsStoreDescriptor = services.SingleOrDefault(d =>
                    d.ServiceType == typeof(SecretsStore));
                if (secretsStoreDescriptor != null)
                {
                    services.Remove(secretsStoreDescriptor);
                }

                services.AddSingleton(_persistentSecretsStore);
            }


            // Register DbContext factory options
            services.AddSingleton(provider =>
            {
                var options = new DbContextOptionsBuilder<SimpleProductOrderServiceDbContext>();
                if (databaseProviderSingleton.IsSQLite)
                {
                    options.UseSqlite(appSettings.ConnectionString);
                }
                else if (databaseProviderSingleton.IsMSSQL)
                {
                    options.UseSqlServer(appSettings.ConnectionString);
                }
                else
                {
                    throw new InvalidOperationException("Unsupported database provider.");
                }

                return options.Options;
            });

            // Register DbContext as SCOPED (not singleton)
            services.AddScoped<SimpleProductOrderServiceDbContext>(provider =>
            {
                var options = provider.GetRequiredService<DbContextOptions<SimpleProductOrderServiceDbContext>>();
                return new SimpleProductOrderServiceDbContext(options);
            });

            // Configure TenantDbContextFactory to use scoped DbContext
            services.AddScoped<TenantDbContextFactory>();

            // Create and initialize the database just once
            var sp = services.BuildServiceProvider();
            using (var scope = sp.CreateScope())
            {
                var scopedServices = scope.ServiceProvider;
                var db = scopedServices.GetRequiredService<SimpleProductOrderServiceDbContext>();
                db.Database.EnsureDeleted();
                db.Database.EnsureCreated();
            }
        });
    }

    public IDatabaseProviderSingleton GetDatabaseProviderSingleton()
    {
        var scope = Services.CreateScope();
        return scope.ServiceProvider.GetRequiredService<IDatabaseProviderSingleton>();
    }

    public SimpleProductOrderServiceDbContext CreateDbContext()
    {
        var scope = Services.CreateScope();
        return scope.ServiceProvider.GetRequiredService<SimpleProductOrderServiceDbContext>();
    }
}
