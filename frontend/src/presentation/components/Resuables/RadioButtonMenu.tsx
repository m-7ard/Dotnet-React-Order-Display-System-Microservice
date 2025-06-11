import React, { useRef, useEffect } from "react";
import StatelessRadioCheckboxField from "../StatelessFields/RadioCheckbox/StatelessRadioCheckboxField";
import Divider from "./Divider";
import { RenderedMixinPanel, PolymorphicMixinPanelSection } from "./MixinPanel";

function RadioButtonMenu(props: {
    screenReaderDescription: string;
    name: string;
    options: Array<{ value: string; label: string }>;
    onChange: (value: string) => void;
    onClose: () => void;
    rulingValue: string;
}) {
    const { options, onChange, onClose, rulingValue, name, screenReaderDescription } = props;

    const menuRef = useRef<HTMLFieldSetElement>(null);

    // Focus management for dropdown menu
    useEffect(() => {
        if (menuRef.current) {
            const firstRadio = menuRef.current.querySelector('input[type="radio"]') as HTMLInputElement;
            firstRadio?.focus();
        }
    }, []);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    return (
        <RenderedMixinPanel
            exp={(options) => ({
                hasBorder: true,
                hasShadow: true,
                size: options.SIZE.BASE,
                theme: options.THEMES.GENERIC_WHITE,
            })}
            role="radiogroup"
            aria-label="Sort products by"
            aria-orientation="vertical"
        >
            {(props) => (
                <fieldset {...props} ref={menuRef}>
                    {options.map((option, index) => {
                        const id = `orderby-${option.value.replace(/\s+/g, "-")}`;
                        return (
                            <React.Fragment key={option.value}>
                                <PolymorphicMixinPanelSection className="flex flex-row gap-5 items-center justify-between">
                                    <label htmlFor={id} className="text-sm cursor-pointer flex-1">
                                        {option.label}
                                    </label>
                                    <StatelessRadioCheckboxField
                                        name={name}
                                        onChange={onChange}
                                        value={option.value}
                                        checked={rulingValue === option.value}
                                        id={id}
                                    />
                                </PolymorphicMixinPanelSection>
                                {index < options.length - 1 && <Divider aria-hidden="true" />}
                            </React.Fragment>
                        );
                    })}

                    {/* Hidden description for screen readers */}
                    <legend className="sr-only">
                        {screenReaderDescription}
                    </legend>
                </fieldset>
            )}
        </RenderedMixinPanel>
    );
}

export default RadioButtonMenu;
