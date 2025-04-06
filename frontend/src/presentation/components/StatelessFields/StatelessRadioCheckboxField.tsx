type IStatelessRadioCheckboxFieldProps = {
    name: string;
    value: string;
    onChange: (value: string) => void;
    checked: boolean;
};

function StatelessRadioCheckboxField(props: IStatelessRadioCheckboxFieldProps) {
    const { name, value, onChange, checked } = props;

    return (
        <div className={["mixin-checkbox-like mixin-checkbox-sm theme-checkbox-generic-white"].join(" ")}>
            <div data-role="inner-part"></div>
            <input
                name={name}
                value={value}
                type="radio"
                checked={checked}
                onChange={() => {
                    onChange(value);
                }}
            ></input>
        </div>
    );
}

export default StatelessRadioCheckboxField;
