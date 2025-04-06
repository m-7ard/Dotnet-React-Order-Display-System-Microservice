using Application.Common;
using Application.Interfaces.Persistence;
using Domain.Contracts.DraftImages;
using Domain.Contracts.Orders;
using Domain.Contracts.Products;
using Domain.DomainExtension;
using Domain.DomainFactories;
using Domain.Models;
using Domain.ValueObjects.Order;
using Domain.ValueObjects.ProductHistory;
using Infrastructure;
using Infrastructure.Interfaces;
using Infrastructure.Persistence;
using Infrastructure.Querying;
using Microsoft.Extensions.Logging.Abstractions;

namespace Tests.IntegrationTests;

public class Mixins
{
    private readonly SimpleProductOrderServiceDbContext _dbContexts;
    private readonly IProductRepository _productRepository;
    private readonly IDraftImageRepository _draftImageRepository;
    private readonly IProductHistoryRepository _productHistoryRepository;
    private readonly IOrderRepository _orderRespository;
    private readonly ISequenceService _sequenceService;

    public Mixins(SimpleProductOrderServiceDbContext simpleProductOrderServiceDbContext, IDatabaseProviderSingleton databaseProviderSingleton)
    {
        _dbContexts = simpleProductOrderServiceDbContext;
        _productRepository = new ProductRepository(_dbContexts, new ProductDbEntityQueryServiceFactory(databaseProviderSingleton));
        _draftImageRepository = new DraftImageRepository(_dbContexts);
        _productHistoryRepository = new ProductHistoryRespository(_dbContexts, new ProductHistoryDbEntityQueryServiceFactory(databaseProviderSingleton));
        _orderRespository = new OrderRepository(_dbContexts, new OrderDbEntityQueryServiceFactory(databaseProviderSingleton));
        _sequenceService = new SequenceService(_dbContexts, NullLogger<SequenceService>.Instance);
    }

    public async Task<Product> CreateProduct(int number, List<DraftImage> images)
    {
        var productId = Guid.NewGuid();
        var product = Product.ExecuteCreate(new CreateProductContract(
            id: productId,
            name: $"Product #{number}",
            price: number,
            description: $"Product #{number} Description",
            dateCreated: DateTime.UtcNow,
            amount: 1_000_000,
            images: []
        ));

        foreach (var image in images)
        {
            product.ExecuteAddProductImage(id: Guid.NewGuid(), fileName: image.FileName.Value, originalFileName: image.OriginalFileName.Value, url: image.Url);    
        }

        await _productRepository.CreateAsync(product);

        foreach (var draftImage in images)
        {
            await _draftImageRepository.DeleteByFileNameAsync(draftImage.FileName);
        }

        return product!;
    }

    public async Task<Product> CreateProductAndProductHistory(int number, List<DraftImage> images)
    {
        var product = await CreateProduct(number: number, images: images);
        var inputProductHistory = ProductHistoryFactory.BuildNewProductHistory(
            id: ProductHistoryId.ExecuteCreate(Guid.NewGuid()),
            name: product.Name,
            images: product.Images.Select(image => image.FileName.Value).ToList(),
            price: product.Price,
            productId: product.Id,
            description: product.Description
        );

        await _productHistoryRepository.CreateAsync(inputProductHistory);

        return product;
    }

    public async Task<DraftImage> CreateDraftImage(TestFileRoute fileRoute, string destinationFileName)
    {
        // Copy a file from [fileRoute] that is an existing file's path
        // To a destination, where it includes the fileName in the path at the end
        File.Copy(fileRoute.Value, Path.Join(DirectoryService.GetMediaDirectory(), destinationFileName), overwrite: true);

        var contract = new CreateNewDraftImageContract(fileName: destinationFileName, originalFileName: "originalFileName.png", url: $"Media/{destinationFileName}");
        var draftImage = DraftImage.ExecuteCreateNew(contract);

        await _draftImageRepository.CreateAsync(draftImage);

        return draftImage;
    }

    public async Task<Order> CreateFinishedOrder(List<Product> products, int seed) {
        var order = await CreateNewOrder(products: products, seed: seed);
        foreach (var orderItem in order.OrderItems)
        {
            OrderDomainExtension.ExecuteMarkOrderItemFinished(order, orderItem.Id.Value, DateTime.UtcNow);
        }
        
        order.ExecuteTransitionStatus(new TransitionOrderStatusContract(status: OrderStatus.Finished.Name, dateCreated: order.OrderSchedule.Dates.DateCreated, dateFinished: DateTime.UtcNow));
        await _orderRespository.UpdateAsync(order);
        return order;
    }

    public async Task<Order> CreateNewOrder(List<Product> products, int seed) {
        var order = OrderDomainExtension.ExecuteCreateNewOrder(id: Guid.NewGuid(), serialNumber: await _sequenceService.GetNextOrderValueAsync());

        foreach (var product in products)
        {
            var productHistory = await _productHistoryRepository.GetLatestByProductIdAsync(product.Id);
            if (productHistory is null)
            {
                throw new Exception("A Product's ProductHistory cannot be null when creating an Order because an Order's OrderItems need a non-null ProductHistoryId.");
            }
            
            var contract = new AddNewOrderItemContract(
                order: order,
                id: Guid.NewGuid(), 
                productId: product.Id,
                productHistoryId: productHistory.Id, 
                quantity: seed, 
                serialNumber: await _sequenceService.GetNextOrderItemValueAsync(),
                total: product.Price.Value * seed
            );

            OrderDomainExtension.ExecuteAddNewOrderItem(contract);
        }

        await _orderRespository.CreateAsync(order);
        var insertedOrder = await _orderRespository.GetByIdAsync(order.Id);
        if (insertedOrder is null)
        {
            throw new Exception("Order was not inserted.");
        }

        return insertedOrder;
    }
}