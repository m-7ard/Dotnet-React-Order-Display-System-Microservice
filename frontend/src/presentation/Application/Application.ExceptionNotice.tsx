import { useEffect, useRef } from "react";
import Divider from "../components/Resuables/Divider";
import { RenderedMixinPanel, PolymorphicMixinPanelSection } from "../components/Resuables/MixinPanel";
import { useApplicationExceptionContext } from "./Application.ExceptionProvider.Context";
import { RenderedMixinButton } from "../components/Resuables/MixinButton";

export default function ApplicationExceptionNotice() {
    const { exception, dismissException } = useApplicationExceptionContext();
    const dialogRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    // Focus management
    useEffect(() => {
        if (exception && closeButtonRef.current) {
            // Focus the close button when dialog opens
            closeButtonRef.current.focus();
        }
    }, [exception]);

    // Handle escape key
    useEffect(() => {
        if (!exception) return;

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                dismissException();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [exception, dismissException]);

    // Trap focus within the dialog
    useEffect(() => {
        if (exception == null || dialogRef.current == null) return;

        const dialog = dialogRef.current;
        const focusableElements = dialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        const handleTabKey = (event: KeyboardEvent) => {
            if (event.key !== "Tab") return;

            if (event.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement?.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement?.focus();
                }
            }
        };

        dialog.addEventListener("keydown", handleTabKey);
        return () => dialog.removeEventListener("keydown", handleTabKey);
    }, [exception]);

    if (exception == null) {
        return null;
    }

    return (
        <>
            {/* Backdrop for screen readers */}
            <div className="fixed inset-0 bg-black bg-opacity-0" style={{ zIndex: 999999 }} aria-hidden="true" />

            <RenderedMixinPanel
                className="fixed mx-auto top-4 left-4 right-4"
                exp={(options) => ({
                    hasBorder: true,
                    hasShadow: true,
                    size: options.SIZE.BASE,
                    theme: options.THEMES.GENERIC_WHITE,
                })}
            >
                {(mixinPanelProps) => (
                    <div
                        {...mixinPanelProps}
                        ref={dialogRef}
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="exception-title"
                        aria-describedby="exception-message"
                        style={{ zIndex: 1_000_000 }}
                    >
                        <PolymorphicMixinPanelSection as="header" className="flex flex-row gap-3 items-center justify-between">
                            <div id="exception-title" className="token-default-title">
                                Exception
                            </div>
                            <RenderedMixinButton
                                options={{
                                    size: "mixin-button-sm",
                                    theme: "theme-button-generic-white",
                                }}
                                hasShadow
                                onClick={dismissException}
                                aria-label="Close exception dialog"
                            >
                                {(props) => (
                                    <button ref={closeButtonRef} {...props}>
                                        Close
                                    </button>
                                )}
                            </RenderedMixinButton>
                        </PolymorphicMixinPanelSection>
                        <Divider />
                        <PolymorphicMixinPanelSection>
                            <div id="exception-message">{exception.message}</div>
                        </PolymorphicMixinPanelSection>
                    </div>
                )}
            </RenderedMixinPanel>
        </>
    );
}
