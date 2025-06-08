import { Link } from "@tanstack/react-router";
import CoverImage from "../../components/Resuables/CoverImage";
import MixinButton from "../../components/Resuables/MixinButton";
import MixinPrototypeCard, { MixinPrototypeCardSection } from "../../components/Resuables/MixinPrototypeCard";

export default function Navigator(props: { title: string; imageUrl: string; buttons: Array<{ label: string; href: string }> }) {
    const { title, imageUrl, buttons } = props;

    return (
        <MixinPrototypeCard
            style={{ gridTemplateColumns: "auto 1fr" }}
            options={{
                size: "mixin-Pcard-base",
                theme: "theme-Pcard-generic-white",
            }}
            hasShadow
            hasDivide
        >
            <MixinPrototypeCardSection className="flex flex-row gap-3">
                <div className="flex gap-3 bg-white w-full">
                    <MixinButton
                        options={{
                            size: "mixin-button-base",
                            theme: "theme-button-generic-white",
                        }}
                        isStatic
                        className="w-full justify-center"
                    >
                        <CoverImage src={imageUrl} className="h-full aspect-square" alt={`${title} thumbnail`} />
                        <div className="truncate">{title}</div>
                    </MixinButton>
                </div>
            </MixinPrototypeCardSection>
            <MixinPrototypeCardSection className="flex flex-col gap-1">
                {buttons.map(({ label, href }) => (
                    <Link to={href} className="col-start-2" key={href}>
                        <MixinButton className="w-full justify-center" options={{ size: "mixin-button-base", theme: "theme-button-generic-yellow" }}>
                            {label}
                        </MixinButton>
                    </Link>
                ))}
            </MixinPrototypeCardSection>
        </MixinPrototypeCard>
    );
}