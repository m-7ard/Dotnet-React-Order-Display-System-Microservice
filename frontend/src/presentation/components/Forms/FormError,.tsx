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
        >
            <MixinPrototypeCardSection>
                <div className="token-card--header--primary-text">{title}</div>
                <div className="token-card--header--secondary-text">Form Errors</div>
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
