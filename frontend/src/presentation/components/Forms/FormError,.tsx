import MixinPrototypeCard, { MixinPrototypeCardSection } from "../Resuables/MixinPrototypeCard";

function FormError(props: { title: string; errors?: string[] } & React.HtmlHTMLAttributes<HTMLDivElement>) {
    const { title, errors, ...htmlAttributes } = props;

    return errors == null ? null : (
        <MixinPrototypeCard
            options={{
                size: "mixin-Pcard-base",
                theme: "theme-Pcard-generic-white",
            }}
            hasBorder
            hasDivide
            {...htmlAttributes}
            className="rounded-none"
        >
            <MixinPrototypeCardSection>
                <div className="text-sm font-bold">{title}</div>
                <div className="text-xs">Form Errors</div>
            </MixinPrototypeCardSection>
            <MixinPrototypeCardSection>
                {errors.map((error) => (
                    <div key={error} className="text-sm">&bull; {error}</div>
                ))}
            </MixinPrototypeCardSection>
        </MixinPrototypeCard>
    );
}

export default FormError;
