import Divider from "../components/Resuables/Divider";
import MixinButton from "../components/Resuables/MixinButton";
import { RenderedMixinPanel, PolymorphicMixinPanelSection } from "../components/Resuables/MixinPanel";
import { useApplicationExceptionContext } from "./Application.ExceptionProvider.Context";

export default function ApplicationExceptionNotice() {
    const { exception, dismissException } = useApplicationExceptionContext();

    if (exception == null) {
        return null;
    }

    return (
        <RenderedMixinPanel
            className="fixed mx-auto top-4 left-4 right-4"
            exp={(options) => ({ hasBorder: true, hasShadow: true, size: options.SIZE.BASE, theme: options.THEMES.GENERIC_WHITE })}
        >
            {(mixinPanelProps) => (
                <div {...mixinPanelProps} style={{ zIndex: 1_000_000 }}>
                    <PolymorphicMixinPanelSection as="header" className="flex flex-row gap-3 items-center justify-between">
                        <div className="token-default-title">Exception</div>
                        <MixinButton
                            options={{
                                size: "mixin-button-sm",
                                theme: "theme-button-generic-white",
                            }}
                            hasShadow
                            onClick={dismissException}
                        >
                            Close
                        </MixinButton>
                    </PolymorphicMixinPanelSection>
                    <Divider />
                    <PolymorphicMixinPanelSection>
                        <div>{exception.message}</div>
                    </PolymorphicMixinPanelSection>
                </div>
            )}
        </RenderedMixinPanel>
    );
}
