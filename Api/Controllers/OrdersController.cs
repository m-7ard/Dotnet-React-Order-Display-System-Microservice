using System.Net;
using Api.DTOs.OrderItems.MarkFinished;
using Api.DTOs.Orders.Create;
using Api.DTOs.Orders.List;
using Api.DTOs.Orders.MarkFinished;
using Api.DTOs.Orders.Read;
using Api.Errors;
using Api.Interfaces;
using Api.Services;
using Application.Errors;
using Application.Errors.Objects;
using Application.Handlers.OrderItems.MarkFinished;
using Application.Handlers.Orders.Create;
using Application.Handlers.Orders.List;
using Application.Handlers.Orders.MarkFinished;
using Application.Handlers.Orders.Read;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[AllowAnonymous]
[Route("api/orders/")]
public class OrdersController : ControllerBase
{
    private readonly ISender _mediator;
    private readonly IValidator<CreateOrderRequestDTO.OrderItem> _orderItemDataValidator;
    private readonly IApiModelService _apiModelService;

    public OrdersController(ISender mediator, IValidator<CreateOrderRequestDTO.OrderItem> createProductValidator, IApiModelService apiModelService)
    {
        _mediator = mediator;
        _orderItemDataValidator = createProductValidator;
        _apiModelService = apiModelService;
    }

    [HttpPost("create")]
    public async Task<ActionResult<CreateOrderResponseDTO>> Create(CreateOrderRequestDTO request)
    {
        if (request.OrderItemData.Count == 0)
        {
            return BadRequest(
                new List<ApiError>()
                {
                    PlainApiErrorHandlingService.CreateError(
                        path: ["orderItemData", "_"],
                        message: "Order Item Data cannot be empty.",
                        code: ApiErrorCodes.VALIDATION_ERROR
                    )
                }
            );
        }

        var errors = new List<ApiError>();
        foreach (var (uid, orderItemData) in request.OrderItemData)
        {
            var validation = _orderItemDataValidator.Validate(orderItemData);
            if (validation.IsValid)
            {
                continue;
            }

            errors.AddRange(PlainApiErrorHandlingService.FluentToApiErrors(validationFailures: validation.Errors, path: ["orderItemData", uid]));
        }

        if (errors.Count > 0)
        {
            return BadRequest(errors);
        }

        var id = Guid.NewGuid();
        var command = new CreateOrderCommand
        (
            orderItemData: request.OrderItemData.ToDictionary(
                kvp => kvp.Key,
                kvp => new CreateOrderCommand.OrderItem(
                    productId: kvp.Value.ProductId,
                    quantity: kvp.Value.Quantity
                )
            ),
            id: id
        );

        var result = await _mediator.Send(command);
        if (result.IsT1)
        {
            var handlerErrors = result.AsT1;
            var firstError = handlerErrors.First();

            List<string>? pathPrefix = null;
            if (firstError is CannotCreateOrderItemError)
            {
                pathPrefix = ["orderItemData"];
            }

            return BadRequest(PlainApiErrorHandlingService.MapApplicationErrors(handlerErrors, pathPrefix: pathPrefix));
        }

        var respone = new CreateOrderResponseDTO(orderId: id.ToString());
        return StatusCode(StatusCodes.Status201Created, respone);
    }

    [HttpGet("list")]
    public async Task<ActionResult<ListOrdersResponseDTO>> List(
        [FromQuery] Guid? id,
        [FromQuery] decimal? minTotal,
        [FromQuery] decimal? maxTotal,
        [FromQuery] string? status,
        [FromQuery] DateTime? createdBefore,
        [FromQuery] DateTime? createdAfter,
        [FromQuery] Guid? productId,
        [FromQuery] Guid? productHistoryId,
        [FromQuery] string? orderBy,
        [FromQuery] int? orderSerialNumber,
        [FromQuery] int? orderItemSerialNumber)
    {

        var parameters = new ListOrdersRequestDTO(
            id: id,
            minTotal: minTotal,
            maxTotal: maxTotal,
            status: status,
            createdBefore: createdBefore,
            createdAfter: createdAfter,
            productId: productId,
            productHistoryId: productHistoryId,
            orderBy: orderBy,
            orderSerialNumber: orderSerialNumber,
            orderItemSerialNumber: orderItemSerialNumber
        );

        if (parameters.MinTotal is not null && parameters.MinTotal < 0)
        {
            parameters.MinTotal = null;
        }

        if (parameters.MaxTotal is not null && parameters.MinTotal is not null && parameters.MinTotal > parameters.MaxTotal)
        {
            parameters.MinTotal = null;
            parameters.MaxTotal = null;
        }

        if (parameters.CreatedBefore is not null && parameters.CreatedAfter is not null && parameters.CreatedBefore > parameters.CreatedAfter)
        {
            parameters.CreatedBefore = null;
            parameters.CreatedAfter = null;
        }

        if (parameters.OrderSerialNumber.HasValue && parameters.OrderSerialNumber <= 0) {
            parameters.OrderSerialNumber = 0;
        }

        if (parameters.OrderItemSerialNumber.HasValue && parameters.OrderItemSerialNumber <= 0) {
            parameters.OrderItemSerialNumber = 0;
        }

        var query = new ListOrdersQuery(
            minTotal: parameters.MinTotal,
            maxTotal: parameters.MaxTotal,
            status: parameters.Status,
            createdBefore: parameters.CreatedBefore,
            createdAfter: parameters.CreatedAfter,
            id: parameters.Id,
            productId: parameters.ProductId,
            productHistoryId: parameters.ProductHistoryId,
            orderBy: parameters.OrderBy,
            orderSerialNumber: orderSerialNumber,
            orderItemSerialNumber: orderItemSerialNumber
        );

        var result = await _mediator.Send(query);

        if (result.TryPickT1(out var errors, out var value))
        {
            return BadRequest(PlainApiErrorHandlingService.MapApplicationErrors(errors));
        }

        var response = new ListOrdersResponseDTO(orders: await _apiModelService.CreateManyOrderApiModel(value.Orders));
        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ReadOrderResponseDTO>> Read(string id)
    {
        bool validId = Guid.TryParse(id, out var parsedId);
        if (!validId)
        {
            return NotFound();
        }

        var query = new ReadOrderQuery(id: parsedId);
        var result = await _mediator.Send(query);

        if (result.TryPickT1(out var errors, out var value))
        {
            var expectedError = errors.First();
            if (expectedError.Code is SpecificApplicationErrorCodes.ORDER_EXISTS_ERROR)
            {
                return NotFound(PlainApiErrorHandlingService.MapApplicationErrors(errors));
            }
            
            return StatusCode((int)HttpStatusCode.InternalServerError, PlainApiErrorHandlingService.MapApplicationErrors(errors));
        };

        var response = new ReadOrderResponseDTO(order: await _apiModelService.CreateOrderApiModel(value.Order));
        return Ok(response);
    }

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
            if (expectedError is OrderDoesNotExistError)
            {
                return NotFound(PlainApiErrorHandlingService.MapApplicationErrors(errors));
            }


            return BadRequest(PlainApiErrorHandlingService.MapApplicationErrors(errors));
        };

        var response = new MarkOrderItemFinishedResponseDTO(orderId: value.OrderId.ToString(), orderItemId: value.OrderItemId.ToString(), dateFinished: value.DateFinished);
        return Ok(response);
    }

    [HttpPut("{orderId}/mark_finished")]
    public async Task<ActionResult<MarkOrderFinishedResponseDTO>> MarkFinished(Guid orderId)
    {
        var command = new MarkOrderFinishedCommand(
            orderId: orderId
        );

        var result = await _mediator.Send(command);

        if (result.TryPickT1(out var errors, out var value))
        {
            var expectedError = errors.First();
            if (expectedError is OrderDoesNotExistError)
            {
                return NotFound(PlainApiErrorHandlingService.MapApplicationErrors(errors));
            }

            return BadRequest(PlainApiErrorHandlingService.MapApplicationErrors(errors));
        };

        var response = new MarkOrderFinishedResponseDTO(orderId: value.OrderId.ToString(), dateFinished: TimeZoneService.ConvertUtcToLocalTime(value.DateFinished));
        return Ok(response);
    }
}