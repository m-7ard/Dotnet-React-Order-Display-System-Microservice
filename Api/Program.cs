using System.Globalization;
using Api.Interfaces;
using Api.Middleware;
using Api.Services;
using Api.Validators;
using Application.DomainService;
using Application.Handlers.Products.Create;
using Application.Interfaces.Persistence;
using Application.Interfaces.Services;
using FluentValidation;
using Infrastructure.Files;
using Infrastructure.Interfaces;
using Infrastructure.Persistence;
using Infrastructure.Querying;
using Microsoft.AspNetCore.Localization;

// dotnet ef migrations add <Name> --project Infrastructure --startup-project Api
var builder = WebApplication.CreateBuilder(args);

var appSettings = BuilderUtils.ReadAppSettings(builder.Configuration);
var databaseProviderSingleton = new DatabaseProviderSingleton(appSettings.DatabaseProviderValue);


// HttpContextAccessor
builder.Services.AddHttpContextAccessor();

///
///
/// DB / database / dbcontext
/// 

builder.Services.AddSingleton<TenantDatabaseService>();
builder.Services.AddScoped<TenantDbContextFactory>(sp =>
{
    return new TenantDbContextFactory(
        sp.GetRequiredService<TenantDatabaseService>(),
        sp.GetRequiredService<IHttpContextAccessor>(),
        sp.GetRequiredService<IDatabaseProviderSingleton>(),
        null // Explicitly pass null for test context in regular operation
    );
});
builder.Services.AddScoped(sp => sp.GetRequiredService<TenantDbContextFactory>().CreateDbContext());

var services = builder.Services;

///
///
/// Localisation
/// 

{
    services.AddLocalization(options => options.ResourcesPath = "Resources");

    services.Configure<RequestLocalizationOptions>(options =>
    {
        var supportedCultures = new[] { new CultureInfo("en-US") };
        options.DefaultRequestCulture = new RequestCulture("en-US");
        options.SupportedCultures = supportedCultures;
        options.SupportedUICultures = supportedCultures;
    });

    services.AddControllers()
        .ConfigureApiBehaviorOptions(options =>
        {
            options.SuppressModelStateInvalidFilter = true;
        })
        .AddViewLocalization()
        .AddDataAnnotationsLocalization();
}

///
///
/// React Cors
/// 

var apiCorsPolicy = "AllowReactApp";
services.AddCors(options =>
{
    options.AddPolicy(apiCorsPolicy,
        builder =>
        {
            builder.WithOrigins("http://localhost:5173") // React app URL
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .AllowAnyHeader();
        });
});


///
///
/// Mediatr
/// 

builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(CreateProductHandler).Assembly));

///
///
/// Dependency Injection / DI / Services
/// 

builder.Services.AddSingleton<IDatabaseProviderSingleton>(databaseProviderSingleton);
builder.Services.AddScoped<ISequenceService, SequenceService>();

builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IProductHistoryRepository, ProductHistoryRespository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IDraftImageRepository, DraftImageRepository>();

builder.Services.AddScoped<IProductDbEntityQueryServiceFactory, ProductDbEntityQueryServiceFactory>();
builder.Services.AddScoped<IOrderDbEntityQueryServiceFactory, OrderDbEntityQueryServiceFactory>();
builder.Services.AddScoped<IProductHistoryDbEntityQueryServiceFactory, ProductHistoryDbEntityQueryServiceFactory>();

builder.Services.AddScoped<IApiModelService, ApiModelService>();
builder.Services.AddSingleton<IFileStorage, FileStorage>();

builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IProductDomainService, ProductDomainService>();

builder.Services.AddScoped<IProductHistoryDomainService, ProductHistoryDomainService>();
builder.Services.AddScoped<IOrderDomainService, OrderDomainService>();
builder.Services.AddScoped<IDraftImageDomainService, DraftImageDomainService>();
builder.Services.AddScoped<IProductDomainService, ProductDomainService>();

///
///
/// Fluent Validation DI / Dependency Injection
/// 

builder.Services.AddValidatorsFromAssembly(typeof(UpdateProductValidator).Assembly);

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseRequestLocalization();

///
///
/// Middlware
/// 

app.UseMiddleware<TenantMiddleware>();

///
///
/// Startup behaviour
/// 

using (var scope = app.Services.CreateScope())
{
    /*
    var localService = scope.ServiceProvider;
    var context = localService.GetRequiredService<SimpleProductOrderServiceDbContext>();

    try
    {
        context.Database.EnsureDeleted();
        context.Database.EnsureCreated();
    }
    catch (Exception ex)
    {
        var logger = localService.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while resetting the database.");
    }
    */
}


app.UseCors(apiCorsPolicy);
app.UseAuthentication();
app.UseAuthorization();

app.UseDefaultFiles();
app.UseStaticFiles();
app.MapFallbackToFile("react/index.html");

app.UseHttpsRedirection();
app.MapControllers();

app.Run();

public partial class Program {  }
