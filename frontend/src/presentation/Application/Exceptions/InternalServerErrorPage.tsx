import MixinPage, { MixinPageSection } from "../../components/Resuables/MixinPage";
import { useRef } from "react";
import contentGridDirective from "../../directives/contentGridDirective";
import { useRouterLoaderData } from "../../routes/RouterModule/RouterModule.hooks";

export default function InternalServerErrorPage() {
    const { error } = useRouterLoaderData((routes) => routes.INTERNAL_SERVER_ERROR);
    const errorRef = useRef(error);

    console.error(errorRef.current);

    return (
        <MixinPage exp={(options) => ({ size: options.SIZE.BASE })} directives={[contentGridDirective(() => ({}))]} className={`flex flex-col items-center justify-center`}>
            <MixinPageSection className="text-4xl font-bold text-gray-800 text-center">An Internal Server Error Occured.</MixinPageSection>
            <MixinPageSection className="text-xl font-bold text-gray-700 text-center whitespace-pre">{errorRef.current.message}</MixinPageSection>
        </MixinPage>
    );
}
