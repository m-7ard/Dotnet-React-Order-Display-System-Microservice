import FilterOrdersFieldset from "../../../components/Fieldsets/FilterOrdersFieldset";
import Divider from "../../../components/Resuables/Divider";
import MixinButton from "../../../components/Resuables/MixinButton";
import { RenderedMixinPanel, PolymorphicMixinPanelSection } from "../../../components/Resuables/MixinPanel";
import { ValueSchema } from "./FilterOrders.Controller";

export default function FilterOrdersDialogPanel(props: {
    value: Required<ValueSchema>;
    onSubmit: () => void;
    onReset: () => void;
    onClose: () => void;
    onChange: (value: Required<ValueSchema>) => void;
    onClear: () => void;
}) {
    const { value, onSubmit, onReset, onClose, onChange, onClear } = props;

    return (
        <RenderedMixinPanel exp={(options) => ({ hasBorder: true, hasShadow: true, size: options.SIZE.BASE, theme: options.THEMES.GENERIC_WHITE })} className="flex flex-col">
            {(mixinPanelProps) => (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit();
                    }}
                    onReset={(e) => {
                        e.preventDefault();
                        onReset();
                    }}
                    {...mixinPanelProps}
                >
                    <PolymorphicMixinPanelSection className="flex flex-row justify-between items-center shrink-0">
                        <MixinButton
                            options={{
                                size: "mixin-button-sm",
                                theme: "theme-button-generic-white",
                            }}
                            onClick={onClose}
                            className=""
                            type="button"
                        >
                            Close
                        </MixinButton>
                    </PolymorphicMixinPanelSection>
                    <Divider />
                    <PolymorphicMixinPanelSection className="flex flex-col gap-3 overflow-auto">
                        <div className="token-default-title">Filter Orders</div>
                        <FilterOrdersFieldset value={value} onChange={onChange} />
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
                </form>
            )}
        </RenderedMixinPanel>
    );
}
