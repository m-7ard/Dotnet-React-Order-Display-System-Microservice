import { FormPageValueState, FormPageErrorState } from "./FilterProductResults.Pages.Form";

export interface IFilterProductResultsProps {
    resultComponents: Array<React.ReactNode>;
    route: Routes;
    changeRoute: (route: Routes) => void;
    form: {
        onReset: () => void;
        onSubmit: () => void;
        onChange: (value: FormPageValueState) => void;
        value: FormPageValueState;
        errors: FormPageErrorState;
    };
}

export type Routes = "form" | "result";