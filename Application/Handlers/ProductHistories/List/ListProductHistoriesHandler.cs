using Application.Contracts.Criteria;
using Application.Errors;
using Application.Interfaces.Persistence;
using MediatR;
using OneOf;

namespace Application.Handlers.ProductHistories.List;

public class ListProductHistoriesHandler : IRequestHandler<ListProductHistoriesQuery, OneOf<ListProductHistoriesResult, List<ApplicationError>>>
{
    private readonly IProductHistoryRepository _productHistoryRepository;

    public ListProductHistoriesHandler(IProductHistoryRepository productHistoryRepository)
    {
        _productHistoryRepository = productHistoryRepository;
    }

    public async Task<OneOf<ListProductHistoriesResult, List<ApplicationError>>> Handle(ListProductHistoriesQuery request, CancellationToken cancellationToken)
    {
        Tuple<string, bool>? orderBy = new Tuple<string, bool>("ValidFrom", false);
        if (request.OrderBy == "newest")
        {
            orderBy = new Tuple<string, bool>("ValidFrom", false);
        }
        else if (request.OrderBy == "oldest")
        {
            orderBy = new Tuple<string, bool>("ValidFrom", true);
        }
        else if (request.OrderBy == "price desc")
        {
            orderBy = new Tuple<string, bool>("Price", false);
        }
        else if (request.OrderBy == "price asc")
        {
            orderBy = new Tuple<string, bool>("Price", true);
        }
        // Legacy from integer id
        // else if (request.OrderBy == "product id desc")
        // {
        //     orderBy = new Tuple<string, bool>("OriginalProductId", false);
        // }
        // else if (request.OrderBy == "product id asc")
        // {
        //     orderBy = new Tuple<string, bool>("OriginalProductId", true);
        // }

        var criteria = new FilterProductHistoriesCriteria(
            name: request.Name,
            minPrice: request.MinPrice,
            maxPrice: request.MaxPrice,
            description: request.Description,
            validFrom: request.ValidFrom,
            validTo: request.ValidTo,
            productId: request.ProductId,
            orderBy: orderBy
        );
        var productHistories = await _productHistoryRepository.FindAllAsync(criteria);

        var result = new ListProductHistoriesResult(productHistories: productHistories);
        return result;
    }
}