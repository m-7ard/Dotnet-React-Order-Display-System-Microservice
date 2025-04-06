# Dotnet 8.0 React Order Display System

## Table of Contents
1. [Defaults](#defaults)
2. [Override Defaults](#override-defaults)
3. [Local Setup](#run-locally)
4. [Features](#features)
5. [Demo Videos](#demo-videos)
6. [Sample Code](#code-samples)
    - [Domain Models](#domain-models)
    - [Value Objects](#value-objects)
    - [Domain Services](#domain-services)
    - [CQRS Application Layer Architecture](#CQRS-application-layer-architecture)
    - [Database Cross Compatability](#database-cross-compatibility)
    - [API Model Service](#api-model-service)
    - [Controller Presenter Pattern React Components](#controller-presenter-pattern-react-components)
    - [Composable React Components](#composable-react-components)
    - [Frontend Request Error Handling](#frontend-request-error-handling)
    - [Common Interface for Frontend Router](#common-interface-for-frontend-router)
7. [Lessons Learned](#lessons-learned)
8. [API Reference](#api-reference)
    - [Products API](#products-api-endpoints)
    - [Orders API](#orders-api-endpoints)
    - [Draft Images API](#draft-images-api-endpoints)
    - [Product Histories API](#product-histories-api-endpoints)
9. [Error Handling](#error-handling)
10. [Authentication](#authentication)

## Defaults
### Backend
- When running docker, the port will be 5000

- When running the dev server, the port will be 5102
- The default database is SQLite, for both production and testing.

- When running docker, Media is stored in a volume /app/media
- When the dev server, Media is stored in a folder at /Files/Media in production, and /Files/Media/Tests when testing.

- The databse and media are cleared / reset on each startup.

### Frontend
- When running docker, the api url will be http://localhost:5000
- When running the dev server, the api url will be http://localhost:5102

- The application uses a Tanstack Router by default

## Override Defaults
### Backend
- To change the docker port, go to docker-compose.yml and fill in your desired port, then, go to frontend\.env.production to reflect the new port

- To change the production and development database, go to Api\appsettings.json and change Database:Provider to either "SqlServer" or "Sqlite", then, change the matching ${provider}_Database string to your connection string
- To change the testing database, do the same as above but withing the Testing section

## Local Setup
### Project Setup

1. Clone the project
```bash
git clone https://github.com/m-7ard/Dotnet-React-Order-Display-System-.git
```

2.A Use Docker
```bash
docker compose up
```

2.B Use Dev Server

3. Backend Setup
```bash
# Restore NuGet dependencies
dotnet restore

# Navigate to API directory
cd Api

# Run the backend server
dotnet watch run
# OR for release
dotnet publish -c Release
```

4. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start frontend server
npm run dev
```

## Features
- Product Management
- Automatic Product Histories / Archives
- Order Management
- Database cross-compatibility
- Product Image Upload and Management
- Value Objects to Enforce Business Rules
- Injectable Validators to Reuse Application Logic
- Backend Integration Tests
- Backend Application Layer Unit Tests
- Common interface for frontend routers
- Frontend Validation
- Frontend Request Error Handling

## Technical Stack
### Backend
- Framework: .NET Core 8.0, ASP.NET Web APIs
- ORM: Entity Framework Core with MSSQL or Sqlite
- Architecture: CQRS with MediatR, Domain Driven Design
- Validation: FluentValidation, Value Objects, Domain Methods
- Testing: xUnit, Moq
### Frontend
- UI: React, Typescript
- React Libs: Tanstack Query, Tanstack Router
- CSS: Tailwind CSS, SCSS
- Other: Superstruct, neverthrow, jsonpointer, typebox

## Architecture
The application follows Clean Architecture principles with distinct layers:
- API (Presentation Layer)
- Application (Business Logic, Business Logic-Linked Validation)
- Domain (Business Rules)
- Infrastructure (Data Access)

## Demo Videos

### Create Product
![Watch the video](readmeVids/createProduct.gif)

### Create Order
![Watch the video](readmeVids/createOrder.gif)

### Manage Order
![Watch the video](readmeVids/manageOrder.gif)

### Update Product
![Watch the video](readmeVids/updateProduct.gif)

### Order Products By
![Watch the video](readmeVids/orderProducts.gif)

### Filter Products
![Watch the video](readmeVids/filterProducts.gif)

## Sample Code

### Domain Models
Example of rich domain model with encapsulated business rules:

This Order domain features methods to manage its OrderItems. These methods will produce domain events as side effects, that will then later be used to repositories at the time of persistence

```csharp
public class Order
{
    public Order(OrderId id, int serialNumber, Money total, OrderSchedule orderSchedule, List<OrderItem> orderItems)
    {
        Id = id;
        SerialNumber = serialNumber;
        Total = total;
        OrderSchedule = orderSchedule;
        OrderItems = orderItems;
    }

    public OrderId Id { get; private set; }
    public int SerialNumber { get; private set; }
    public Money Total { get; set; }
    public OrderSchedule OrderSchedule { get; set; }
    public List<OrderItem> OrderItems { get; set; }

    public List<DomainEvent> DomainEvents { get; set; } = [];
    public void ClearEvents()
    {
        DomainEvents = [];
    }

    private readonly Dictionary<OrderStatus, List<OrderStatus>> _validStatusStatusTransitions = new()
    {
        { OrderStatus.Pending, [OrderStatus.Finished] },
        { OrderStatus.Finished, [] },
    };

    public OneOf<bool, string> CanTransitionStatus(TransitionOrderStatusContract contract)
    {
        // OrderStatus
        var canCreateStatus = OrderStatus.CanCreate(contract.Status);
        if (canCreateStatus.IsT1) return canCreateStatus.AsT1;

        var newStatus = OrderStatus.ExecuteCreate(contract.Status);

        var currentStatus = OrderSchedule.Status;
        if (!_validStatusStatusTransitions.TryGetValue(currentStatus, out var transitionList)) return $"No transitions exist for status \"{currentStatus}\".";

        var transitionExists = transitionList.Exists(status => status == newStatus); 
        if (!transitionExists) return $"Invalid status transition from {currentStatus} to {newStatus}.";


        // OrderDates
        var canCreateDates = OrderDates.CanCreate(dateCreated: contract.DateCreated, dateFinished: contract.DateFinished);
        if (canCreateDates.IsT1) return canCreateDates.AsT1;

        var newOrderDates = OrderDates.ExecuteCreate(dateCreated: contract.DateCreated, dateFinished: contract.DateFinished); 


        // OrderSchedule
        var canCreateSchedule = OrderSchedule.CanCreate(newStatus, newOrderDates);
        if (canCreateSchedule.IsT1) return canCreateSchedule.AsT1;


        return true;
    }

    public void ExecuteTransitionStatus(TransitionOrderStatusContract contract)
    {
        var canTransitionStatus = CanTransitionStatus(contract);
        if (canTransitionStatus.IsT1)
        {
            throw new Exception(canTransitionStatus.AsT1);
        }

        var newStatus = OrderStatus.ExecuteCreate(contract.Status);
        var newOrderDates = OrderDates.ExecuteCreate(dateCreated: contract.DateCreated, dateFinished: contract.DateFinished); 
        var newSchedule = OrderSchedule.ExecuteCreate(newStatus, newOrderDates);
        OrderSchedule = newSchedule;
    }

    public OneOf<bool, string> CanTransitionOrderItem(OrderItemId id, TransitionOrderItemStatusContract contract)
    {
        var tryGetResult = TryGetOrderItemById(id);
        if (tryGetResult.IsT1) return tryGetResult.AsT1;

        var orderItem = tryGetResult.AsT0;

        var canTransitionStatusResult = orderItem.CanTransitionStatus(contract);
        if (canTransitionStatusResult.IsT1) return canTransitionStatusResult.AsT1;

        return true;
    }

    public OneOf<bool, string> CanAddOrderItem(AddOrderItemContract contract)
    {
        // Order Item
        var createOrderItemContract = new CreateOrderItemContract(
            id: contract.Id,
            productId: contract.ProductId,
            productHistoryId: contract.ProductHistoryId,
            quantity: contract.Quantity,
            status: contract.Status,
            serialNumber: contract.SerialNumber,
            dateCreated: contract.DateCreated,
            dateFinished: contract.DateFinished
        );

        var canCreateOrderItem = OrderItem.CanCreate(createOrderItemContract);
        if (canCreateOrderItem.TryPickT1(out var error, out _))
        {
            return error;
        }

        var existingOrderItem = OrderItems.Find(orderItem => orderItem.ProductId == contract.ProductId);
        if (existingOrderItem is not null)
        {
            return "Product has already been added as an Order Item.";
        }

        // Order
        var canCreateTotal = Money.CanCreate(contract.Total);
        if (canCreateTotal.TryPickT1(out error, out _))
        {
            return error;
        }

        return true;
    }

    public OrderItemId ExecuteAddOrderItem(AddOrderItemContract contract) 
    {
        var canAddOrderItemResult = CanAddOrderItem(contract);
        if (canAddOrderItemResult.TryPickT1(out var error, out var _))
        {
            throw new Exception(error);
        }

        var createOrderItemContract = new CreateOrderItemContract(
            id: contract.Id,
            productId: contract.ProductId,
            productHistoryId: contract.ProductHistoryId,
            quantity: contract.Quantity,
            status: contract.Status,
            serialNumber: contract.SerialNumber,
            dateCreated: contract.DateCreated,
            dateFinished: contract.DateFinished
        );

        var orderItem = OrderItem.ExecuteCreate(createOrderItemContract);
        OrderItems.Add(orderItem);
        DomainEvents.Add(new OrderItemCreatedEvent(orderItem));

        Total += Money.ExecuteCreate(contract.Total);
        return orderItem.Id;
    }

    public OneOf<OrderItem, string> TryGetOrderItemById(OrderItemId orderItemId)
    {
        var orderItem =  OrderItems.Find(orderItem => orderItem.Id == orderItemId);
        if (orderItem == null)
        {
            return $"Order Item of Id \"{orderItemId}\" does not exist on Order of Id \"{Id}\"";
        }

        return orderItem;
    }

    public OrderItem ExecuteGetOrderItemById(OrderItemId orderItemId)
    {
        var canGetOrderItemResult = TryGetOrderItemById(orderItemId);
        if (canGetOrderItemResult.TryPickT1(out var error, out var orderItem))
        {
            throw new Exception(error);
        }

        return orderItem;
    }

    public static OneOf<bool, string> CanCreate(CreateOrderContract contract)
    {
        var canCreateId = OrderId.CanCreate(contract.Id);
        if (canCreateId.IsT1) return canCreateId.AsT1;

        var canCreateTotal = Money.CanCreate(contract.Total);
        if (canCreateTotal.IsT1) return canCreateTotal.AsT1;
        
        var canCreateStatus = OrderStatus.CanCreate(contract.Status);
        if (canCreateStatus.IsT1) return canCreateStatus.AsT1;
        
        var canCreateDates = OrderDates.CanCreate(dateCreated: contract.DateCreated, dateFinished: contract.DateFinished);
        if (canCreateDates.IsT1) return canCreateDates.AsT1;

        // Relationships
        var status = OrderStatus.ExecuteCreate(contract.Status);
        var dates = OrderDates.ExecuteCreate(dateCreated: contract.DateCreated, dateFinished: contract.DateFinished);
        var canCreateSchedule = OrderSchedule.CanCreate(status: status, dates: dates);
        if (canCreateSchedule.IsT1) return canCreateSchedule.AsT1;
        
        return true;
    }

    public static Order ExecuteCreate(CreateOrderContract contract)
    {
        var id = OrderId.ExecuteCreate(contract.Id);
        var total = Money.ExecuteCreate(contract.Total);
        var status = OrderStatus.ExecuteCreate(contract.Status);
        var dates = OrderDates.ExecuteCreate(dateCreated: contract.DateCreated, dateFinished: contract.DateFinished);
        var schedule = OrderSchedule.ExecuteCreate(status: status, dates: dates);

        return new Order(
            id: id,
            serialNumber: contract.SerialNumber,
            total: total,
            orderSchedule: schedule,
            orderItems: contract.OrderItems
        );
    }
}
```

### Value Objects
Example of value objects to enforce constraints between related fields:

This value object enforces the logical values of the dates

```csharp
public class OrderSchedule : ValueObject
{
    public OrderStatus Status { get; }
    public OrderDates Dates { get; }

    private OrderSchedule(OrderStatus status, OrderDates dates)
    {
        Status = status;
        Dates = dates;
    }

    private static readonly Dictionary<OrderStatus, Func<OrderDates, List<DateTime?>>> _orderStatusRequirements = new()
    {
        { OrderStatus.Pending, orderDates => [orderDates.DateCreated] },
        { OrderStatus.Finished, orderDates => [orderDates.DateCreated, orderDates.DateFinished] }
    };

    private static OneOf<bool, string> ValidateOrderSchedule(OrderStatus orderStatus, OrderDates orderDates)
    {
        var dates = _orderStatusRequirements[orderStatus].Invoke(orderDates);
        if (dates.Any(date => date is null))
        {
            return $"Invalid OrderSchedule; OrderDate requirement for status \"{orderStatus}\" was failed to be met.";
        }

        return true;
    } 

    public static OrderSchedule ExecuteCreate(OrderStatus status, OrderDates dates)
    {
        var validationResult = CanCreate(status, dates);

        if (validationResult.TryPickT1(out var error, out _))
        {
            throw new Exception(error);
        }

        return new OrderSchedule(status, dates);
    }

    public static OneOf<bool, string> CanCreate(OrderStatus status, OrderDates dates)
    {
        var validateOrderScheduleResult = ValidateOrderSchedule(status, dates);
        if (validateOrderScheduleResult.TryPickT1(out var error, out _))
        {
            return error;
        }

        return true;
    }

    public static OneOf<OrderSchedule, string> TryCreate(OrderStatus status, OrderDates dates)
    {
        var canCreateResult = CanCreate(status, dates);
        if (canCreateResult.TryPickT1(out var error, out _))
        {
            return error;
        }

        return ExecuteCreate(status, dates);
    }


    public override IEnumerable<object> GetEqualityComponents()
    {
        yield return Status;
        yield return Dates;
    }
}
```

### Domain Services

The following demonstrates a Order Domain Service that will encapsulate the bounded context of the order and orchestrate complex logic for us

```csharp
public class OrderDomainService : IOrderDomainService
{
    private readonly IProductDomainService _productDomainService;
    private readonly IProductHistoryDomainService _productHistoryDomainService;
    private readonly ISequenceService _sequenceService;
    private readonly IProductRepository _productRepository;

    public OrderDomainService(IProductDomainService productDomainService, IProductHistoryDomainService productHistoryDomainService, ISequenceService sequenceService, IProductRepository productRepository)
    {
        _productDomainService = productDomainService;
        _productHistoryDomainService = productHistoryDomainService;
        _sequenceService = sequenceService;
        _productRepository = productRepository;
    }

    public async Task<OneOf<Order, string>> TryOrchestrateCreateNewOrder(Guid id)
    {
        var serialNumber = await _sequenceService.GetNextOrderValueAsync();
        var canCreateOrder = OrderDomainExtension.CanCreateNewOrder(id: id, serialNumber: serialNumber);
        if (canCreateOrder.IsT1) return canCreateOrder.AsT1;
        
        return OrderDomainExtension.ExecuteCreateNewOrder(id: id, serialNumber: serialNumber);
    }

    public async Task<OneOf<bool, string>> TryOrchestrateAddNewOrderItem(OrchestrateAddNewOrderItemContract contract)
    {
        var order = contract.Order;
        var productId = contract.ProductId;
        var quantity = contract.Quantity;

        // Product Exists
        var productExistsResult = await _productDomainService.GetProductById(productId);
        if (productExistsResult.IsT1) return productExistsResult.AsT1;
        
        var product = productExistsResult.AsT0;

        // Product History Exists
        var latestProductHistoryExistsResult = await _productHistoryDomainService.GetLatestProductHistoryForProduct(product);
        if (latestProductHistoryExistsResult.IsT1) return latestProductHistoryExistsResult.AsT1;

        var productHistory = latestProductHistoryExistsResult.AsT0;

        // Lower Product Amount
        var canLowerAmount = product.CanLowerAmount(quantity);
        if (canLowerAmount.IsT1) return $"Order Item quantity ({quantity}) cannot be larger than Product amount ({product.Amount})";

        product.ExecuteLowerAmount(quantity);

        // Check if Product History is valid
        if (!productHistory.IsValid()) return $"Product History for Product of Id \"{product.Id}\" is not valid.";

        // Add Order Item
        var addNewOrderItemContract = new AddNewOrderItemContract(
            order: order,
            id: Guid.NewGuid(),
            serialNumber: await _sequenceService.GetNextOrderItemValueAsync(),
            quantity: quantity,
            productId: product.Id,
            productHistoryId: productHistory.Id,
            total: product.Price.Value * quantity
        );
        
        var canAddOrderItem = OrderDomainExtension.CanAddNewOrderItem(addNewOrderItemContract);
        if (canAddOrderItem.IsT1) return canAddOrderItem.AsT1;

        OrderDomainExtension.ExecuteAddNewOrderItem(addNewOrderItemContract);

        // Update Product
        await _productRepository.LazyUpdateAsync(product);
        
        return true;
    }
}
```

### CQRS Application Layer Architecture

This handler demonstrated the implementation of a command handler create an order making use of its Domain Service

```csharp
public class CreateOrderHandler : IRequestHandler<CreateOrderCommand, OneOf<CreateOrderResult, List<ApplicationError>>>
{
    private readonly IOrderRepository _orderRepository;
    private readonly IProductRepository _productRepository;
    private readonly IOrderDomainService _orderDomainService;
    private readonly IUnitOfWork _unitOfWork;

    public CreateOrderHandler(IOrderRepository orderRepository, IProductRepository productRepository, IOrderDomainService orderDomainService, IUnitOfWork unitOfWork)
    {
        _orderRepository = orderRepository;
        _productRepository = productRepository;
        _orderDomainService = orderDomainService;
        _unitOfWork = unitOfWork;
    }

    public async Task<OneOf<CreateOrderResult, List<ApplicationError>>> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        // Create New Order 
        var tryCreateOrder = await _orderDomainService.TryOrchestrateCreateNewOrder(request.Id);
        if (tryCreateOrder.IsT1) return new CannotCreateOrderError(message: tryCreateOrder.AsT1, path: []).AsList();
        
        var order = tryCreateOrder.AsT0;

        // Create Order Items
        var validationErrors = new List<ApplicationError>();

        foreach (var (uid, orderItem) in request.OrderItemData)
        {
            var tryAddOrderItem = await _orderDomainService.TryOrchestrateAddNewOrderItem(new OrchestrateAddNewOrderItemContract(order: order, productId: orderItem.ProductId, quantity: orderItem.Quantity));
            if (tryAddOrderItem.IsT1)
            {
                validationErrors.Add(new CannotCreateOrderItemError(message: tryAddOrderItem.AsT1, path: [uid]));
            }
        }

        if (validationErrors.Count > 0)
        {
            return validationErrors;
        }

        await _orderRepository.CreateAsync(order);
        await _unitOfWork.SaveAsync();

        return new CreateOrderResult();
    }
}
```

### Controller Error Delegation

Through the use of application error code, we can delegate appropriate error codes from our controller

```csharp
[ApiController]
[AllowAnonymous]
[Route("api/orders/")]
public class OrdersController : ControllerBase
{
    private readonly ISender _mediator;
    private readonly IApiModelService _apiModelService;

    ...
    ...
    ...

    [HttpPut("{orderId}/item/{orderItemId}/mark_finished")]
    public async Task<ActionResult<MarkOrderItemFinishedResponseDTO>> MarkOrderItemFinished(Guid orderId, Guid orderItemId)
    {
        var query = new MarkOrderItemFinishedCommand(
            orderId: orderId,
            orderItemId: orderItemId
        );

        var result = await _mediator.Send(query);

        if (result.TryPickT1(out var errors, out var value))
        {
            var expectedError = errors.First();
            if (expectedError.Code is SpecificApplicationErrorCodes.ORDER_EXISTS_ERROR)
            {
                return NotFound(PlainApiErrorHandlingService.MapApplicationErrors(errors));
            }


            return BadRequest(PlainApiErrorHandlingService.MapApplicationErrors(errors));
        };

        var response = new MarkOrderItemFinishedResponseDTO(orderId: value.OrderId.ToString(), orderItemId: value.OrderItemId.ToString(), dateFinished: value.DateFinished);
        return Ok(response);
    }
}

```

### Database Cross Compatability

The following demonstrated a query service for products, that will handle the technical issue of ordering a table by a decimal in SQLite not being possible, by using a deferred in-memory execution to order the table

```csharp
public class ProductDbEntityQueryServiceFactory : IProductDbEntityQueryServiceFactory
{
    private readonly IDatabaseProviderSingleton _databaseProvider;

    public ProductDbEntityQueryServiceFactory(IDatabaseProviderSingleton databaseProvider)
    {
        _databaseProvider = databaseProvider;
    }

    public ProductDbEntityQueryService Create(IQueryable<ProductDbEntity> query)
    {
        return new ProductDbEntityQueryService(databaseProvider: _databaseProvider, query: query);
    }
}

public class ProductHistoryDbEntityQueryService
{
    private readonly List<Func<List<ProductHistoryDbEntity>, List<ProductHistoryDbEntity>>> _inMemoryCallbacks = [];
    private readonly IDatabaseProviderSingleton _databaseProvider;
    private readonly Dictionary<string, Expression<Func<ProductHistoryDbEntity, object>>> _fieldMapping = new()
    {
        { "Price", p => p.Price },
        { "ValidFrom", p => p.ValidFrom },
        { "OriginalProductId", p => p.OriginalProductId }
    };

    private IQueryable<ProductHistoryDbEntity> _query;


    public ProductHistoryDbEntityQueryService(IDatabaseProviderSingleton databaseProvider, IQueryable<ProductHistoryDbEntity> query)
    {
        _databaseProvider = databaseProvider;
        _query = query;
    }

    private void SortInMemory(string field, bool ascending)
    {
        var orderByExpression = _fieldMapping[field];

        _inMemoryCallbacks.Add((products) => ascending
            ? products.OrderBy(orderByExpression.Compile()).ToList()
            : products.OrderByDescending(orderByExpression.Compile()).ToList());
    }

    private void SortInDatabase(string field, bool ascending)
    {
        var orderByExpression = _fieldMapping[field];
        
        _query = ascending
            ? _query.OrderBy(orderByExpression) 
            : _query.OrderByDescending(orderByExpression);
    }

    public void ApplyOrderBy(Tuple<string, bool> policy)
    {
        var (field, ascending) = policy;
     
        if (_databaseProvider.IsSQLite)
        {
            SortInMemory(field, ascending);
        }
        else if (_databaseProvider.IsMSSQL)
        {
            SortInDatabase(field, ascending);
        }
        else
        {
            throw new Exception($"No handler for FilterAllAsync for database provider \"{_databaseProvider.Value}\".");
        }
    }

    public async Task<List<ProductHistoryDbEntity>> ReturnResult()
    {
        var result = await _query.ToListAsync();
        return _inMemoryCallbacks.Aggregate(result, (current, func) => func(current));
    }
}
```


### API Model Service
Example of API model service implementation with caching:

```csharp
public class ApiModelService : IApiModelService
{
    private readonly Dictionary<ProductHistoryId, ProductHistory?> ProductHistoryCache = new Dictionary<ProductHistoryId, ProductHistory?>();
    private readonly IProductHistoryRepository _productHistoryRepository;

    public ApiModelService(IProductHistoryRepository productHistoryRepository)
    {
        _productHistoryRepository = productHistoryRepository;
    }


    private async Task<ProductHistory?> GetProductHistoryFromCacheOrDb(ProductHistoryId id) 
    {
        if (ProductHistoryCache.TryGetValue(id, out var cachedProductHistory))
        {
            return cachedProductHistory;
        } 

        var productHistory = await _productHistoryRepository.GetByIdAsync(id);
        ProductHistoryCache[id] = productHistory;
        return productHistory;
    }

    public async Task<OrderApiModel> CreateOrderApiModel(Order order)
    {
        var orderItems = new List<OrderItemApiModel>();

        foreach (var orderItem in order.OrderItems)
        {
            var productHistory = await GetProductHistoryFromCacheOrDb(orderItem.ProductHistoryId);
            if (productHistory == null)
            {
                throw new Exception($"ProductHistory of Id \"{orderItem.ProductHistoryId}\" from OrderItem of Id \"${orderItem.Id}\"");
            }

            orderItems.Add(ApiModelMapper.OrderItemToApiModel(orderItem, productHistory));
        }
        
        return ApiModelMapper.OrderToApiModel(order, orderItems);
    }

    public async Task<List<OrderApiModel>> CreateManyOrderApiModel(List<Order> orders)
    {
        var orderApiModels = new List<OrderApiModel>();
        
        foreach (var order in orders)
        {
            orderApiModels.Add(await CreateOrderApiModel(order));
        }

        return orderApiModels;
    }
}
```

### Controller Presenter Pattern React Components
Example of a Controller - Presenter architecture in React:
```tsx
// CreateOrder.Controller.tsx

const initialValues: ValueSchema = {
    orderItemData: {},
};

const initialErrors: ErrorState = {};

export default function CreateOrderController(props: { orderDataAccess: IOrderDataAccess }) {
    const { orderDataAccess } = props;
    const responseHandler = useResponseHandler();

    const itemManager = useItemManager<ValueSchema>(initialValues);
    const errorManager = useItemManager<ErrorState>(initialErrors);

    const navigate = useNavigate();
    const createOrderMutation = useMutation({
        ...
    });

    return (
        <CreateOrderPage
            onSubmit={createOrderMutation.mutate}
            onReset={() => {
                itemManager.setAll(initialValues);
                errorManager.setAll(initialErrors);
            }}
            onChange={(value) => {
                itemManager.setAll(value);
            }}
            errors={errorManager.items}
            value={itemManager.items}
        />
    );
}

export default function CreateOrderPage(props: {
    onSubmit: () => void;
    onReset: () => void;
    onChange: (value: ValueSchema) => void;
    errors: ErrorState;
    value: ValueSchema;
}) {
    const { onSubmit, onReset, errors, value, onChange } = props;

    const updateField = useCallback(
        <T extends keyof ValueSchema>(fieldName: T, fieldValue: ValueSchema[T]) => {
            const newFormValue = { ...value };
            newFormValue[fieldName] = fieldValue;
            onChange(newFormValue);
        },
        [onChange, value],
    );

    return (
        <MixinPage
            as="form"
            onSubmit={async (e) => {
                e.preventDefault();
                onSubmit();
            }}
            onReset={(e) => {
                e.preventDefault();
                onReset();
            }}
            exp={(options) => ({ size: options.SIZE.BASE })}
            directives={[contentGridDirective(() => ({}))]}
        >
            <MixinPageSection className="flex flex-row gap-3 items-center">
                <LinkBoxV2 exp={(routes) => routes.CREATE_ORDER} params={{}} />
            </MixinPageSection>
            <Divider />
            <MixinPageSection className="flex flex-col gap-3">
                <div className="token-default-title">Create Order</div>
                <FormError title="Failed to Create Order" errors={errors._} />
                <FormField name="orderItemData" errors={errors.orderItemData?._}>
                    <OrderItemDataField
                        value={value.orderItemData}
                        errors={errors.orderItemData}
                        onChange={(value) => {
                            updateField("orderItemData", value);
                        }}
                    />
                </FormField>
            </MixinPageSection>
            <Divider />
            <MixinPageSection className="flex flex-row gap-3 justify-end">
                <MixinButton options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }} type="reset">
                    Reset
                </MixinButton>
                <MixinButton options={{ size: "mixin-button-base", theme: "theme-button-generic-green" }} type="submit">
                    Submit
                </MixinButton>
            </MixinPageSection>
        </MixinPage>
    );
}
```

### Composable React Components
Example of composable components through props
```tsx
interface IMixinButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    options: {
        size: "mixin-button-sm" | "mixin-button-base";
        theme?: "theme-button-generic-white" | "theme-button-generic-yellow" | "theme-button-generic-green" | "theme-button-generic-red";
    };
    isStatic?: boolean;
    active?: boolean;
    hasShadow?: boolean;
}

export default function MixinButton(props: PropsWithChildren<IMixinButtonProps>) {
    const { options, active = false, className, isStatic = false, hasShadow = false, children, ...HTMLattrs } = props;

    const staticMixinClass = isStatic ? "mixin-button-like--static" : "";
    const staticThemeClass = isStatic ? `${options.theme}--static` : "";
    const hasShadowClass = hasShadow ? `shadow` : "";

    return (
        <button data-active={active} className={["mixin-button-like", options.size, options.theme, className, staticMixinClass, staticThemeClass, hasShadowClass].join(" ")} {...HTMLattrs}>
            {children}
        </button>
    );
}
```

```tsx
type MixinPrototypeCardProps<E extends ElementType> = PolymorphicProps<E> & {
    options: {
        size: "mixin-Pcard-base";
        theme: "theme-Pcard-generic-white";
    };
    hasShadow?: boolean;
    hasBorder?: boolean;
    hasDivide?: boolean;
};

export default function MixinPrototypeCard<T extends ElementType = "div">(props: PropsWithChildren<MixinPrototypeCardProps<T>>) {
    const { options, as, className, hasShadow = false, hasBorder = false, hasDivide = false, ...HTMLattrs } = props;
    const Component = as ?? "div";

    const shadowClass = hasShadow ? "token-default-shadow" : "";
    const borderClass = hasBorder ? "border token-default-border-color" : "";
    const divideClass = hasDivide ? "divide-y token-default-divide-color" : "";

    return (
        <Component className={["mixin-Pcard-like", options.size, options.theme, className, shadowClass, borderClass, divideClass].join(" ")} {...HTMLattrs}>
            {props.children}
        </Component>
    );
}

type MixinPrototypeCardSectionProps<E extends ElementType> = PolymorphicProps<E> & { fillBg?: boolean };

export function MixinPrototypeCardSection<T extends ElementType = "section">(props: PropsWithChildren<MixinPrototypeCardSectionProps<T>>) {
    const { as, className, fillBg = false, ...HTMLattrs } = props;
    const Component = as ?? "section";

    const bgClass = fillBg ? "bg-white" : "";

    return (
        <Component className={[className, bgClass].join(" ")} {...HTMLattrs} data-role="Pcard-section">
            {props.children}
        </Component>
    );
}
```

### Frontend Request Error Handling

Example of automatically handling different request failures and / or exceptions

```tsx
export default function useResponseHandler() {
    const { dispatchException } = useApplicationExceptionContext();

    return useCallback(
        async <SuccessType, ErrorType, FallbackType>(props: {
            requestFn: () => Promise<Response>;
            onResponseFn: (response: Response) => Promise<Result<SuccessType, ErrorType>>;
            fallbackValue?: FallbackType;
        }) => {
            const { requestFn, onResponseFn, fallbackValue } = props;

            try {
                const responseResult = await tryHandleRequest(requestFn());
                if (responseResult.isErr()) {
                    dispatchException(responseResult.error);
                    return fallbackValue;
                }

                const response = responseResult.value;
                const result = await onResponseFn(response);
                if (result.isOk()) {
                    return result.value;
                }

                const error = await handleInvalidResponse(response);
                dispatchException(error);
                return result.error;
            } catch (err: unknown) {
                dispatchException(err);
                return fallbackValue;
            }
        },
        [dispatchException],
    );
}
```

### Common Interface for Frontend Router

We use a common interface ICommonRouteMapping interface that enforces the routes that need to be defined for each router implementation, and how its path will be built. This will then later be used in an IRouterModule, that will be passed to an IRouter, which will then be used in an IRouterContext, that gets registered in a DI container to be used in things like loaders to get access to the route mapping, since this is not known to the implementations before runtime.

```tsx
export interface ICommonRouteMapping {
    FRONTPAGE: ICommonRoute<IRouteConfig<TEmptyParams>, TEmptyLoaderData>;

    LIST_ORDERS: ICommonRoute<IRouteConfig<TEmptyParams>, { orders: Order[] }>;
    CREATE_ORDER: ICommonRoute<IRouteConfig<TEmptyParams>, TEmptyLoaderData>;
    MANAGE_ORDER: ICommonRoute<IRouteConfig<IManageOrderParams>, { order: Order }>;

    // ....
}

export interface IRouterModule {
    genericRoutes: ICommonRouteMapping;
    useRouterLoaderData: <T extends TAnyGenericRoute>(exp: (keys: ICommonRouteMapping) => T) => TExtractGenericRouteLoaderData<T>;
    useRouterLocationEq: () => <T extends TAnyGenericRoute>(exp: (keys: ICommonRouteMapping) => T) => boolean;
    useRouterNavigate: () => <T extends TAnyGenericRoute>(props: {
        exp: (keys: ICommonRouteMapping) => T;
        params: TExtractGenericRouteParams<T>;
        search?: Record<string, string>;
    }) => void;
}

export interface IRouter {
    routerModule: IRouterModule;
    render: () => React.ReactNode;
}

interface IRouterContext {
    router: IRouter;
    requestHandler: IRouterRequestHandler
}

function CreateRouter({ router }: { router: IRouter }) {
    return <RouterModule {...router.routerModule}>{router.render()}</RouterModule>;
}

// main.tsx
const router = new TanstackRouter(tanstackRouter);
const requestHandler = new TanstackRequestHandler(router);
diContainer.register(DI_TOKENS.ROUTER_CONTEXT, new TanstackRouterContext(router, requestHandler));

createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
        <CreateRouter router={router} />
    </QueryClientProvider>,
);

```

## Lessons Learned

### The Value of Unit Tests and Integration Tests

The application underwent a significant refactoring process, which included:
- Changing autoincrement keys to GUID
- Creating domain events
- Implementing domain methods
- Implementing value objects
- Refactoring application layer validation
- Refactoring repositories to be database compatible through query services
- Refactoring frontend router to have a common interface and be easily replacable

Unit Tests and Integration Tests were crucial in ensuring the correctness of the refactoring, making the process much more manageable.

### Separating Component Logic and UI Views

The project moved from a single component architecture to a Presenter-Controller component architecture in React, which:
- Clearly separates state and fetch-related logic from views
- Improves component testability
- Increases component reusability

### Meaningful Errors in the Application Layer

The application uses validation error codes in the application layer, allowing for:
- Delegating appropriate responses in controllers
- More precise error handling

### The Value of Common Interfaces

The project moved from a single router implementation to a common interface architecture in React, which:
- Allows easily switching between router
- Avoiding hardcoding loader logic
- Allows easier testing and mocking

### The Value of Bounded Contextx

The project refactored much of its strong domain creation logic into domain services to allow for a easier interface and rapid mocking for unit tests

## API Reference

### Products API Endpoints

#### Create Product
`POST /api/products/create`

**Request Body**:

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| name | string | Product name | Required, max length validation |
| price | decimal | Product price | Required, positive value |
| description | string | Product description | Optional |
| images | List&lt;string&gt; | Image URLs | Max 8 images |

**Responses**:
- `201 Created`: Product successfully created
- `400 Bad Request`: Validation errors

#### List Products
`GET /api/products/list`

**Query Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| id | Guid | Filter by specific product ID |
| name | string | Filter by product name |
| minPrice | decimal | Minimum price filter |
| maxPrice | decimal | Maximum price filter |
| description | string | Filter by product description |
| createdBefore | DateTime | Filter products created before date |
| createdAfter | DateTime | Filter products created after date |
| orderBy | string | Sort products by specific field |

**Responses**:
- `200 OK`: Returns list of products
- `400 Bad Request`: Invalid query parameters

(Other endpoints like Read, Update, and Delete Product are omitted for brevity)

### Orders API Endpoints

#### Create Order
`POST /api/orders/create`

**Request Body**:

| Parameter | Type | Description |
|-----------|------|-------------|
| orderItemData | object | Dictionary of order items |
| orderItemData[uid].productId | string | ID of the product |
| orderItemData[uid].quantity | number | Quantity of the product |

(Other order-related endpoints are omitted for brevity)

### Draft Images API Endpoints

#### Upload Images
`POST /api/draft_images/upload_images`

**Request Body**:

| Parameter | Type | Description |
|-----------|------|-------------|
| files | file[] | List of image files to upload |

**Constraints**:
- Maximum 8 files per upload
- Maximum 8 MB per file
- Allowed extensions: .jpg, .jpeg, .png

### Product Histories API Endpoints

#### List Product Histories
`GET /api/product_histories/list`

**Query Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| name | string | Filter by product name |
| minPrice | number | Minimum product price |
| maxPrice | number | Maximum product price |
| description | string | Filter by product description |
| validTo | datetime | Products valid before this date |
| validFrom | datetime | Products valid after this date |
| productId | string | Filter by specific product ID |
| orderBy | string | Specify ordering of results |

## Error Handling

The API returns structured error responses including:
- Error codes
- Detailed error messages
- Paths to specific validation errors

## Authentication

Currently, the endpoint allows anonymous access.