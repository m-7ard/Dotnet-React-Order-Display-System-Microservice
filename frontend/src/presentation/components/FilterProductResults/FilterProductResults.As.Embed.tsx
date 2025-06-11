import MixinButton from "../Resuables/MixinButton/MixinButton";
import FormPage from "./FilterProductResults.Pages.Form";
import ResultsPage from "./FilterProductResults.Pages.Results";
import Divider from "../Resuables/Divider";
import MixinPrototypeCard, { MixinPrototypeCardSection } from "../Resuables/MixinPrototypeCard";
import { IFilterProductResultsProps } from "./FilterProductResults.Types";

export default function FilterProductResultsEmbed(props: IFilterProductResultsProps) {
    const { resultComponents, route, changeRoute, form } = props;

    return (
        <MixinPrototypeCard
            className="overflow-auto"
            hasBorder
            options={{
                size: "mixin-Pcard-base",
                theme: "theme-Pcard-generic-white",
            }}
        >
            <MixinPrototypeCardSection className="flex flex-row gap-3">
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
            </MixinPrototypeCardSection>
            <Divider />
            <MixinPrototypeCardSection>
                {
                    {
                        form: <FormPage onReset={form.onReset} onSubmit={form.onSubmit} value={form.value} onChange={form.onChange} />,
                        result: <ResultsPage>{resultComponents}</ResultsPage>,
                    }[route]
                }
            </MixinPrototypeCardSection>
        </MixinPrototypeCard>
    );
}
