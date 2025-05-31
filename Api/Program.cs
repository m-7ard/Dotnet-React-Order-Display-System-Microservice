using System.Globalization;
using Api.Interfaces;
using Api.Middleware;
using Api.Producers.Services;
using Api.Services;
using Api.Validators;
using Application.DomainService;
using Application.Handlers.Products.Create;
using Application.Interfaces.Persistence;
using Application.Interfaces.Services;
using FluentValidation;
using Infrastructure.DataAccess;
using Infrastructure.Files;
using Infrastructure.Interfaces;
using Infrastructure.Persistence;
using Infrastructure.Querying;
using Microsoft.AspNetCore.Localization;

// dotnet ef migrations add <Name> --project Infrastructure --startup-project Api
var builder = WebApplication.CreateBuilder(args);

var appSettings = BuilderUtils.ReadAppSettings(builder.Configuration);
var databaseProviderSingleton = new DatabaseProviderSingleton(value: appSettings.DatabaseProviderValue, connectionString: appSettings.ConnectionString);


// HttpContextAccessor
builder.Services.AddHttpContextAccessor();

// Http client for data access services
// -- This is only necessary for the self signed-cert and nothing else
// -- Make sure to remove it when using a CA cert
// -- Replace LocalSecretDataAccess' IHttpClientFactory with a regular HttpClient
var handler = new HttpClientHandler
{
    ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
};
builder.Services.AddHttpClient("InsecureClient")
    .ConfigurePrimaryHttpMessageHandler(() =>
    {
        return new HttpClientHandler
        {
            // Disables SSL certificate validation completely
            ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
        };
    });

builder.Services.AddHealthChecks()
    .AddUrlGroup(
        new Uri($"{appSettings.SecretsServerUrl}/health"),
        name: "secret server",
        configurePrimaryHttpMessageHandler: (_) => new HttpClientHandler
        {
            ServerCertificateCustomValidationCallback = (_, _, _, _) => true
        });

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

// *Hosted service coordinator*
builder.Services.AddSingleton<InitializationCoordinator>();

// *Secrets*
builder.Services.AddSingleton<SecretsStore>();
builder.Services.AddSingleton<ISecretsDataAccess, LocalSecretDataAccess>();
builder.Services.AddHostedService<SecretsInitializer>();

// *Regular dependencies*
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

builder.Services.AddScoped<OrderProducerService>();
builder.Services.AddSingleton<OrderKafkaProducer>();
builder.Services.AddScoped<TenantMiddleware>();
builder.Services.AddScoped<TenantUserService>();

///
///
/// Queue
/// 

builder.Services.AddHostedService<RabbitMqConsumerService>();

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
