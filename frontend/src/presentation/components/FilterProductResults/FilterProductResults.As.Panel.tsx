import MixinButton from "../Resuables/MixinButton";
import { useGlobalDialogPanelContext } from "../Dialog/GlobalDialog.Panel.Context";
import FormPage from "./FilterProductResults.Pages.Form";
import ResultsPage from "./FilterProductResults.Pages.Results";
import Divider from "../Resuables/Divider";
import { IFilterProductResultsProps } from "./FilterProductResults.Types";
import { PolymorphicMixinPanel, PolymorphicMixinPanelSection } from "../Resuables/MixinPanel";

export default function FilterProductResults(props: IFilterProductResultsProps) {
    const { resultComponents, route, changeRoute, form } = props;
    const { onClose } = useGlobalDialogPanelContext();

    return (
        <PolymorphicMixinPanel exp={(options) => ({ hasBorder: true, hasShadow: true, size: options.SIZE.BASE, theme: options.THEMES.GENERIC_WHITE })} className="flex flex-col">
            <PolymorphicMixinPanelSection className="flex flex-row gap-3 items-center justify-between flex-wrap">
                <MixinButton
                    options={{
                        size: "mixin-button-sm",
                        theme: "theme-button-generic-white",
                    }}
                    onClick={onClose}
                    hasShadow
                >
                    Close
                </MixinButton>
            </PolymorphicMixinPanelSection>
            <Divider />
            <PolymorphicMixinPanelSection className="flex flex-row gap-3">
                <MixinButton
                    options={{
                        size: "mixin-button-base",
                        theme: "theme-button-generic-white",
                    }}
                    type="button"
                    onClick={() => changeRoute("form")}
                    active={route === "form"}
                    className="basis-1/2 justify-center"
                >
                    Form
                </MixinButton>
                <MixinButton
                    options={{
                        size: "mixin-button-base",
                        theme: "theme-button-generic-white",
                    }}
                    type="button"
                    onClick={() => changeRoute("result")}
                    active={route === "result"}
                    className="basis-1/2 justify-center"
                >
                    Results
                </MixinButton>
            </PolymorphicMixinPanelSection>
            <Divider />
            <PolymorphicMixinPanelSection className="overflow-auto">
                {
                    {
                        form: <FormPage onReset={form.onReset} onSubmit={form.onSubmit} value={form.value} onChange={form.onChange} />,
                        result: <ResultsPage>{resultComponents}</ResultsPage>,
                    }[route]
                }
            </PolymorphicMixinPanelSection>
        </PolymorphicMixinPanel>
    );
}
