using Api.DTOs.ProductHistories.List;
using Api.Mappers;
using Api.Services;
using Application.Handlers.ProductHistories.List;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[AllowAnonymous]
[Route("api/product_histories/")]
public class ProductHistoryController : ControllerBase
{
    private readonly ISender _mediator;

    public ProductHistoryController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("list")]
    public async Task<ActionResult<ListProductHistoriesResponseDTO>> List(
        [FromQuery] string? name, 
        [FromQuery] decimal? minPrice, 
        [FromQuery] decimal? maxPrice, 
        [FromQuery] string? description, 
        [FromQuery] DateTime? validTo, 
        [FromQuery] DateTime? validFrom,
        [FromQuery] string? productId,
        [FromQuery] string? orderBy)
    {
        Console.WriteLine(orderBy);
        var parameters = new ListProductHistoriesRequestDTO(
            name: name,
            minPrice: minPrice,
            maxPrice: maxPrice,
            description: description,
            validTo: validTo,
            validFrom: validFrom,
            productId: Guid.TryParse(productId, out var parsedId) ? parsedId : null,
            orderBy: orderBy
        );
        if (parameters.Name is not null && parameters.Name.Length == 0)
        {
            parameters.Name = null;
        }

        if (parameters.MinPrice is not null && parameters.MinPrice < 0)
        {
            parameters.MinPrice = null;
        }

        if (parameters.MaxPrice is not null && parameters.MinPrice is not null && parameters.MinPrice > parameters.MaxPrice)
        {
            parameters.MinPrice = null;
            parameters.MaxPrice = null;
        }

        if (parameters.Description is not null && parameters.Description.Length == 0)
        {
            parameters.Description = null;
        }

        if (parameters.ValidTo is not null && parameters.ValidFrom is not null && parameters.ValidTo < parameters.ValidFrom)
        {
            parameters.ValidTo = null;
            parameters.ValidFrom = null;
        }

        var query = new ListProductHistoriesQuery(
            name: parameters.Name,
            minPrice: parameters.MinPrice,
            maxPrice: parameters.MaxPrice,
            description: parameters.Description,
            validTo: parameters.ValidTo,
            validFrom: parameters.ValidFrom,
            productId: parameters.ProductId,
            orderBy: parameters.OrderBy
        );
        var result = await _mediator.Send(query);

        if (result.TryPickT1(out var errors, out var value))
        {
            return BadRequest(PlainApiErrorHandlingService.MapApplicationErrors(errors));
        }

        var response = new ListProductHistoriesResponseDTO(productHistories: value.ProductHistories.Select(ApiModelMapper.ProductHistoryToApiModel).ToList());
        return Ok(response);
    }
}