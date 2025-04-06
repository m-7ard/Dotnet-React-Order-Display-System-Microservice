import { Static, Type } from "@sinclair/typebox";
import parseTypeboxSchemaOrNull from "../../presentation/utils/parseTypeboxSchemaOrNull";
import IListProductHistoriesRequestDTO from "../contracts/productHistories/list/IListProductHistoriesRequestDTO";

const schema = Type.Object({
    minPrice: Type.Number({ minimum: 0 }),
    maxPrice: Type.Number({ minimum: 0, maximum: 10 ** 6 }),
    name: Type.String({ minLength: 1 }),
    validTo: Type.Date(),
    validFrom: Type.Date(),
    description: Type.String({ minLength: 1 }),
    productId: Type.String({ minLength: 1 }),
    orderBy: Type.String({ minLength: 1 }),
});

type Schema = Static<typeof schema>;

export default function parseListProductHistoriesRequestDTO(data: Partial<Record<keyof Schema, unknown>>): IListProductHistoriesRequestDTO {
    return {
        minPrice: parseTypeboxSchemaOrNull(schema.properties.minPrice, data.minPrice),
        maxPrice: parseTypeboxSchemaOrNull(schema.properties.maxPrice, data.maxPrice),
        name: parseTypeboxSchemaOrNull(schema.properties.name, data.name),
        validFrom: parseTypeboxSchemaOrNull(schema.properties.validFrom, data.validFrom),
        validTo: parseTypeboxSchemaOrNull(schema.properties.validTo, data.validTo),
        description: parseTypeboxSchemaOrNull(schema.properties.description, data.description),
        productId: parseTypeboxSchemaOrNull(schema.properties.productId, data.productId),
        orderBy: parseTypeboxSchemaOrNull(schema.properties.orderBy, data.orderBy),
    }
}