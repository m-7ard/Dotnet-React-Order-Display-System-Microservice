/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";
import IProduct from "../../../domain/models/IProduct";
import useItemManager from "../../hooks/useItemManager";
import React, { ComponentProps, useCallback, useState } from "react";
import productMapper from "../../../infrastructure/mappers/productMapper";
import IListProductsResponseDTO from "../../../infrastructure/contracts/products/list/IListProductsResponseDTO";
import { productDataAccess } from "../../deps/dataAccess";
import { FormPageErrorState, FormPageValueState } from "./FilterProductResults.Pages.Form";
import useDefaultErrorHandling from "../../hooks/useResponseHandler";
import { err, ok } from "neverthrow";
import parseListProductsRequestDTO from "../../../infrastructure/parsers/parseListProductsRequestDTO";
import IPlainApiError from "../../../infrastructure/interfaces/IPlainApiError";
import FilterProductResultsEmbed from "./FilterProductResults.As.Embed";
import FilterProductResultsPanel from "./FilterProductResults.As.Panel";
import { Routes } from "./FilterProductResults.Types";
import PresentationErrorFactory from "../../mappers/PresentationErrorFactory";

const FORM_PAGE_INITIAL_DATA = {
    id: "",
    name: "",
    minPrice: "",
    maxPrice: "",
    description: "",
    createdAfter: "",
    createdBefore: "",
};

export default function FilterProductResultsControllerV2<T extends React.FunctionComponent<any>>(props: { ResultElement: T; propsFactory: (product: IProduct) => ComponentProps<T>; renderAs: "embed" | "panel" }) {
    const { ResultElement, propsFactory, renderAs } = props;
    const responseHandler = useDefaultErrorHandling();
    const [route, setRoute] = useState<Routes>("form");
    const changeRoute = useCallback((newRoute: Routes) => setRoute(newRoute), []);

    const formValue = useItemManager<FormPageValueState>(FORM_PAGE_INITIAL_DATA);
    const formErrors = useItemManager<FormPageErrorState>({});

    const searchProductsMutation = useMutation({
        mutationFn: async () => {
            const parsedParams = parseListProductsRequestDTO(formValue.items);
            return await responseHandler({
                requestFn: () => productDataAccess.listProducts(parsedParams),
                onResponseFn: async (response) => {
                    if (response.ok) {
                        setRoute("result");
                        const data: IListProductsResponseDTO = await response.json();
                        const products = data.products.map(productMapper.apiToDomain);
                        return ok(products);
                    } else if (response.status === 400) {
                        const errors: IPlainApiError[] = await response.json();
                        formErrors.setAll(PresentationErrorFactory.ApiErrorsToPresentationErrors(errors));
                        return ok(undefined);
                    }

                    return err(undefined);
                },
                fallbackValue: undefined,
            });
        },
    });

    const searchResults = searchProductsMutation.data ?? [];
    const Component = {
        embed: FilterProductResultsEmbed,
        panel: FilterProductResultsPanel,
    }[renderAs];

    return (
        <Component
            resultComponents={searchResults.map((product) => {
                return <ResultElement {...propsFactory(product) as any} key={product.id} />;
            })}
            route={route}
            changeRoute={changeRoute}
            form={{
                onChange: formValue.setAll,
                errors: formErrors.items,
                onReset: () => formValue.setAll(FORM_PAGE_INITIAL_DATA),
                onSubmit: () => searchProductsMutation.mutate(),
                value: formValue.items,
            }}
        />
    );
}
