import { TObject } from "@sinclair/typebox";
import { AssertError, Value, ValueError } from "@sinclair/typebox/value";
import { err, ok, Result } from "neverthrow";

export default function validateTypeboxSchema<T>(schema :TObject, data: T): Result<T, ValueError[]> {
    try {
        Value.Assert(schema, data);
        return ok(data);
    } catch (error: unknown) {
        const assertError = error as AssertError;
        return err([...assertError.Errors()]);
    }
}