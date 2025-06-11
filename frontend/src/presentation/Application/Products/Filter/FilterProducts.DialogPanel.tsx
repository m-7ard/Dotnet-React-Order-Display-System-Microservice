import MixinButton from "../../../components/Resuables/MixinButton/MixinButton";
import FilterProductsFieldset from "../../../components/Fieldsets/FilterProductFieldset";
import { ValueSchema } from "./FilterProducts.Controller";
import Divider from "../../../components/Resuables/Divider";
import { PolymorphicMixinPanel, PolymorphicMixinPanelSection } from "../../../components/Resuables/MixinPanel";

export default function FilterProductsDialogPanel(props: {
    value: Required<ValueSchema>;
    onSubmit: () => void;
    onReset: () => void;
    onClose: () => void;
    onChange: (value: Required<ValueSchema>) => void;
    onClear: () => void;
}) {
    const { value, onSubmit, onReset, onClose, onChange, onClear } = props;

    return (
        <PolymorphicMixinPanel
            exp={(options) => ({ hasBorder: true, hasShadow: true, size: options.SIZE.BASE, theme: options.THEMES.GENERIC_WHITE })}
            className="flex flex-col"
            as="form"
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
            onReset={(e) => {
                e.preventDefault();
                onReset();
            }}
        >
            <PolymorphicMixinPanelSection className="flex flex-row justify-between items-center flex-wrap">
                <MixinButton
                    options={{
                        size: "mixin-button-sm",
                        theme: "theme-button-generic-white",
                    }}
                    onClick={onClose}
                    type="button"
                >
                    Close
                </MixinButton>
            </PolymorphicMixinPanelSection>
            <Divider />
            <PolymorphicMixinPanelSection className="flex flex-col gap-3 overflow-auto">
                <div className="token-default-title">Filter Products</div>
                <FilterProductsFieldset value={value} onChange={(value) => onChange(value)} />
            </PolymorphicMixinPanelSection>
            <Divider />
            <PolymorphicMixinPanelSection className="flex flex-row gap-3 justify-end">
                <MixinButton options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }} type="button" onClick={onClear}>
                    Clear
                </MixinButton>
                <MixinButton options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }} type="reset" className="ml-auto">
                    Reset
                </MixinButton>
                <MixinButton options={{ size: "mixin-button-base", theme: "theme-button-generic-green" }} type="submit">
                    Filter
                </MixinButton>
            </PolymorphicMixinPanelSection>
        </PolymorphicMixinPanel>
    );
}
