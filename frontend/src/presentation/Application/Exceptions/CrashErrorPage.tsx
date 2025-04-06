import MixinPage, { MixinPageSection } from "../../components/Resuables/MixinPage";
import contentGridDirective from "../../directives/contentGridDirective";

export default function CrashErrorPage() {
    return (
        <MixinPage exp={(options) => ({ size: options.SIZE.BASE })} directives={[contentGridDirective(() => ({}))]} className={`flex flex-col items-center justify-center`}>
            <MixinPageSection className="text-4xl font-bold text-gray-800 text-center">Site Crash.</MixinPageSection>
            <MixinPageSection className="text-xl font-bold text-gray-700 text-center whitespace-pre">An error that could not be handled occured.</MixinPageSection>
        </MixinPage>
    );
}
