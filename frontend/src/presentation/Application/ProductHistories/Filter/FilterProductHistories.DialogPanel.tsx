import MixinButton from "../../../components/Resuables/MixinButton";
import FilterProductHistoriesFieldset from "../../../components/Fieldsets/FilterProductHistoriesFieldset";
import { ValueSchema } from "./FilterProductHistories.Controller";
import Divider from "../../../components/Resuables/Divider";
import { PolymorphicMixinPanel, PolymorphicMixinPanelSection } from "../../../components/Resuables/MixinPanel";

export default function FilterProductHistoriesDialogPanel(props: {
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
            as="form"
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
            onReset={(e) => {
                e.preventDefault();
                onReset();
            }}
            className="flex flex-col"
        >
            <PolymorphicMixinPanelSection className="flex flex-row justify-between items-center flex-wrap gap-3">
                <MixinButton
                    options={{
                        size: "mixin-button-sm",
                        theme: "theme-button-generic-white",
                    }}
                    onClick={onClose}
                    type="button"
                    hasShadow
                >
                    Close
                </MixinButton>
            </PolymorphicMixinPanelSection>
            <Divider />
            <PolymorphicMixinPanelSection className="flex flex-col gap-3 overflow-auto">
                <div className="token-default-title">Filter Product Histories</div>
                <FilterProductHistoriesFieldset value={value} onChange={onChange} />
            </PolymorphicMixinPanelSection>
            <Divider />
            <PolymorphicMixinPanelSection className="flex flex-row gap-3">
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
