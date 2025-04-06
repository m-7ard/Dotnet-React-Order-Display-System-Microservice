import { TSchema } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

export default function parseTypeboxSchemaOrNull<T extends TSchema>(schema :T, data: unknown) {
    try {
        return Value.Parse(schema, data);
    } catch {
        return null;
    }
}