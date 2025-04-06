import { useAbstractTooltipContext } from "../AbtractTooltip/AbstractTooltip.Context";
import AbstractTooltip, { AbstractTooltipTrigger, PolymorphicAbstractTooltipDefaultPanel } from "../renderAbstractTooltip/AbstractTooltip";
import MixinButton from "../Resuables/MixinButton";

type Choice = { value: string | number | null; label: string };

interface StatelessListBoxProps {
    placeholder?: string;
    choices: Array<Choice>;
    value: string;
    onChange: (value: Choice["value"]) => void;
    nullable?: boolean;
}

export default function StatelessListBox(props: StatelessListBoxProps) {
    const { placeholder, choices, value, onChange, nullable } = props;
    const selected = choices.find((choice) => choice.value === value) ?? { value: null, label: placeholder ?? "---" };

    return (
        <AbstractTooltip
            positioning={{ top: "100%", left: "0px", right: "0px" }}
            Trigger={({ open, onToggle }) => (
                <AbstractTooltipTrigger as={"div"} onClick={onToggle}>
                    <MixinButton
                        options={{
                            size: "mixin-button-base",
                            theme: "theme-button-generic-white",
                        }}
                        className="w-full"
                        type="button"
                        active={open}
                    >
                        {selected.label}
                    </MixinButton>
                </AbstractTooltipTrigger>
            )}
            Panel={() => <StatelessListboxOptions choices={choices} selected={selected} onChange={onChange} nullable={nullable ?? false} placeholder={placeholder ?? "---"} />}
        />
    );
}

function StatelessListboxOptions(props: { placeholder: string; choices: Array<Choice>; selected: Choice; onChange: (value: Choice["value"]) => void; nullable: boolean }) {
    const { choices, selected, onChange, nullable, placeholder } = props;
    const { onClose } = useAbstractTooltipContext();

    return (
        <PolymorphicAbstractTooltipDefaultPanel className={"z-50 fixed bg-gray-50 border-gray-900 "}>
            {nullable && (
                <MixinButton
                    options={{
                        size: "mixin-button-base",
                        theme: "theme-button-generic-white",
                    }}
                    className="w-full border-t-0"
                    type="button"
                    active={selected.value === null}
                    onClick={() => {
                        onChange(null);
                        onClose();
                    }}
                >
                    {placeholder}
                </MixinButton>
            )}
            {choices.map((choice) => (
                <MixinButton
                    options={{
                        size: "mixin-button-base",
                        theme: "theme-button-generic-white",
                    }}
                    className="w-full border-t-0"
                    type="button"
                    active={choice.value === selected.value}
                    key={choice.value}
                    onClick={() => {
                        onChange(choice.value);
                        onClose();
                    }}
                >
                    {choice.label}
                </MixinButton>
            ))}
        </PolymorphicAbstractTooltipDefaultPanel>
    );
}
