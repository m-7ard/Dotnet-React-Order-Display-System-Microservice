/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";
import IProduct from "../../../domain/models/IProduct";
import useItemManager from "../../hooks/useItemManager";
import React, { ComponentProps, useCallback, useState } from "react";
import productMapper from "../../../infrastructure/mappers/productMapper";
import { FormPageErrorState, FormPageValueState } from "./FilterProductResults.Pages.Form";
import parseListProductsRequestDTO from "../../../infrastructure/parsers/parseListProductsRequestDTO";
import FilterProductResultsEmbed from "./FilterProductResults.As.Embed";
import FilterProductResultsPanel from "./FilterProductResults.As.Panel";
import { Routes } from "./FilterProductResults.Types";
import { useProductDataAccessBridgeContext } from "../DataAccess/ProductDataAccessBridge/ProductDataAccessBridgeProvider.Context";

const FORM_PAGE_INITIAL_DATA = {
    id: "",
    name: "",
    minPrice: "",
    maxPrice: "",
    description: "",
    createdAfter: "",
    createdBefore: "",
};

export default function FilterProductResultsControllerV2<T extends React.FunctionComponent<any>>(props: {
    ResultElement: T;
    propsFactory: (product: IProduct) => ComponentProps<T>;
    renderAs: "embed" | "panel";
}) {
    // Data
    const { ResultElement, propsFactory, renderAs } = props;

    // Deps
    const [route, setRoute] = useState<Routes>("form");
    const changeRoute = useCallback((newRoute: Routes) => setRoute(newRoute), []);
    const productDataAccessBridge = useProductDataAccessBridgeContext();

    // State
    const formValue = useItemManager<FormPageValueState>(FORM_PAGE_INITIAL_DATA);
    const formErrors = useItemManager<FormPageErrorState>({});

    // Callbacks
    const searchProductsMutation = useMutation({
        mutationFn: async () => {
            const parsedParams = parseListProductsRequestDTO(formValue.items);
            let products = null as IProduct[] | null;

            await productDataAccessBridge.list(parsedParams, {
                onError: (errors) => formErrors.setAll(errors),
                onSuccess: (res) => {
                    setRoute("result");
                    products = res.products.map(productMapper.apiToDomain);
                },
            });

            return products;
        },
    });

    // Computed
    const searchResults = searchProductsMutation.data ?? [];
    const Component = {
        embed: FilterProductResultsEmbed,
        panel: FilterProductResultsPanel,
    }[renderAs];

    return (
        <Component
            resultComponents={searchResults.map((product) => {
                return <ResultElement {...(propsFactory(product) as any)} key={product.id} />;
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
