using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Application.Common;
using Infrastructure;
using Infrastructure.Interfaces;
using Api.Services;

namespace Tests.IntegrationTests;

public class IntegrationWebApplicationFactory<TProgram> : WebApplicationFactory<TProgram> where TProgram : class
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // Remove development database service config
            // **DbContext (Remove)
            var dbContextDescriptor = services.SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<SimpleProductOrderServiceDbContext>));
            if (dbContextDescriptor != null)
            {
                services.Remove(dbContextDescriptor);
            }
            // **DbProviderSingleton
            var dbProviderDescriptor = services.SingleOrDefault(d => d.ServiceType == typeof(IDatabaseProviderSingleton));
            if (dbProviderDescriptor != null)
            {
                services.Remove(dbProviderDescriptor);
            }

            var configuration = services.BuildServiceProvider().GetRequiredService<IConfiguration>();
            var appSettings = BuilderUtils.ReadTestAppSettings(configuration);
            var databaseProviderSingleton = new DatabaseProviderSingleton(appSettings.DatabaseProviderValue);

            // **DbProviderSingleton (Override)
            services.AddSingleton<IDatabaseProviderSingleton>(databaseProviderSingleton);

            // **DbContext (Override)
            services.AddDbContext<SimpleProductOrderServiceDbContext>((sp, options) =>
            {
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
            });

            var sp = services.BuildServiceProvider();

            using (var scope = sp.CreateScope())
            {
                var scopedServices = scope.ServiceProvider;
                var db = scopedServices.GetRequiredService<SimpleProductOrderServiceDbContext>();
                db.Database.EnsureDeleted();
                db.Database.EnsureCreated();
            }

            var projectRoot = DirectoryService.GetMediaDirectory();
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
