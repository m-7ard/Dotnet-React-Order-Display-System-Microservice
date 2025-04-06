import { useCallback } from "react";
import IPresentationError from "../../interfaces/IPresentationError";
import FilterProductsFieldset, { FilterProductsFieldsetValueState } from "../Fieldsets/FilterProductFieldset";
import Divider from "../Resuables/Divider";
import MixinButton from "../Resuables/MixinButton";

export type FormPageValueState = FilterProductsFieldsetValueState;

export type FormPageErrorState = IPresentationError<{
    id: string[];
    name: string[];
    minPrice: string[];
    maxPrice: string[];
    description: string[];
    createdAfter: string[];
    createdBefore: string[];
}>;

export default function FormPage(props: { onReset: () => void; onSubmit: () => void; value: FormPageValueState; onChange: (value: FormPageValueState) => void }) {
    const { onReset, onSubmit, value, onChange } = props;

    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
        if (event.key === "Enter") {
            event.preventDefault();
            onSubmit();
        }
    }, [onSubmit]);

    return (
        <div className="flex flex-col gap-3" onKeyDown={handleKeyDown}>
            <div className="flex flex-col gap-3">
                <FilterProductsFieldset value={value} onChange={onChange} />
            </div>
            <Divider />
            <footer className="flex flex-row gap-3 justify-end shrink-0">
                <MixinButton
                    className="overflow-hidden"
                    options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }}
                    type="button"
                    onMouseUp={(e) => {
                        e.preventDefault();
                        onReset();
                    }}
                >
                    Reset
                </MixinButton>
                <MixinButton
                    className="overflow-hidden"
                    options={{ size: "mixin-button-base", theme: "theme-button-generic-green" }}
                    type="button"
                    onMouseUp={(e) => {
                        e.preventDefault();
                        onSubmit();
                    }}
                >
                    Submit
                </MixinButton>
            </footer>
        </div>
    );
}
