using Api.Errors;
using Application.Common;
using Application.Errors;
using FluentValidation.Results;

namespace Api.Services;

public class PlainApiErrorHandlingService
{
    public static ApiError CreateError(List<string> path, string message, string code)
    {
        return new ApiError(
            code: code,
            path: "/" + string.Join("/", path),
            message: message
        );
    }

    public static List<ApiError> CreateSingleListError(List<string> path, string message, string code)
    {
        return new List<ApiError>()
        {
            CreateError(path: path, message: message, code: code)
        };
    }

    public static List<ApiError> FluentToApiErrors(List<ValidationFailure> validationFailures, List<string> path)
    {
        return validationFailures.Select((error) =>
        {
            var camelCaseFieldName = StringCaseConverter.ToCamelCase(error.PropertyName);
            var fullPath = path.Count == 0
                ? camelCaseFieldName
                : $"/{camelCaseFieldName}/{string.Join("/", path)}";

            return new ApiError(
                code: ApiErrorCodes.VALIDATION_ERROR,
                path: fullPath,
                message: error.ErrorMessage
            );
        }).ToList();
    }

    public static List<ApiError> MapApplicationErrors(List<ApplicationError> errors, List<string>? pathPrefix = null)
    {
        var result = new List<ApiError>();

        errors.ForEach((error) =>
        {
            List<string> finalPath = [..error.Path];

            if (finalPath.Count == 0)
            {
                finalPath = pathPrefix ?? ["_"];        
            }
            else if (pathPrefix is not null)
            {
                finalPath.InsertRange(0, pathPrefix);
            }

            var apiError = CreateError(
                message: error.Message,
                path: finalPath,
                code: ApiErrorCodes.APPLICATION_ERROR
            );
            
            result.Add(apiError);
        });

        return result;
    }
}