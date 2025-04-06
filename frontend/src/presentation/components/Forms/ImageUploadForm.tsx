import { useCallback } from "react";
import IPresentationError from "../../interfaces/IPresentationError";
import { getApiUrl } from "../../../viteUtils";
import CoverImage from "../Resuables/CoverImage";
import MixinButton from "../Resuables/MixinButton";
import MixinPrototypeCard, { MixinPrototypeCardSection } from "../Resuables/MixinPrototypeCard";

export type RequiredImageFormData = {
    url: string;
    originalFileName: string;
    generatedFileName: string;
};
export type GeneratedFileName = string & { _: "generatedFileName" };
export type UploadImageFormValue = Record<GeneratedFileName, RequiredImageFormData>;

export default function UploadImagesForm(props: {
    onSubmit: (files: File[]) => Promise<void>;
    errors?: IPresentationError<{ [generatedFileName: GeneratedFileName]: string[] }>;
    value: UploadImageFormValue;
    onChange: (value: UploadImageFormValue) => void;
}) {
    const { onChange, onSubmit, errors, value } = props;

    const onDelete = useCallback((generatedFileName: GeneratedFileName) => {
        const newValue = {...value};
        delete newValue[generatedFileName];
        onChange(newValue);
    }, [onChange, value]);

    async function uploadImages(event: React.ChangeEvent<HTMLInputElement>): Promise<void> {
        event.preventDefault();

        const { files } = event.target;
        if (files == null) {
            return;
        }

        await onSubmit([...files]);
        event.target.value = "";
    }

    return (
        <MixinPrototypeCard options={{ size: "mixin-Pcard-base", theme: "theme-Pcard-generic-white" }} hasBorder hasDivide>
            <MixinPrototypeCardSection>
                <MixinButton
                    className="w-fit overflow-hidden relative"
                    type="button"
                    options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}
                >
                    <div className="pointer-events-none ">Add Image</div>
                    <input
                        role="addImage"
                        type="file"
                        multiple
                        className="opacity-0 absolute inset-0 cursor-pointer file:cursor-pointer h-full w-full"
                        onChange={async (e) => await uploadImages(e)}
                    ></input>
                </MixinButton>
            </MixinPrototypeCardSection>
            {Object.entries(value).map((entries) => {
                const generatedFileName = entries[0] as GeneratedFileName;
                const imageData = entries[1];

                return (
                    <Image
                        errors={errors?.[generatedFileName]}
                        url={imageData.url}
                        originalFileName={imageData.originalFileName}
                        onDelete={() => onDelete(generatedFileName)}
                        key={generatedFileName}
                    />
                );
            })}
        </MixinPrototypeCard>
    );
}

function Image(props: {
    originalFileName: string;
    url: string;
    onDelete: () => void;
    errors?: string[];
}) {
    const { originalFileName, url, onDelete, errors } = props;

    return (
        <MixinPrototypeCardSection className="flex flex-col gap-3">
            <div className="flex flex-row gap-3">
                <CoverImage
                    className="w-16 h-16 min-w-16 min-h-16 border border-gray-900  overflow-hidden"
                    src={`${getApiUrl()}/${url}`}
                />
                <div className="flex flex-col gap-1 overflow-hidden grow">
                    <div className="text-sm text-medium truncate">{originalFileName}</div>
                    <MixinButton
                        className="ml-auto mt-auto justify-center  "
                        type="button"
                        onClick={onDelete}
                        options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}
                    >
                        Remove
                    </MixinButton>
                </div>
            </div>
            {errors == null ? null : (
                <div className="flex flex-col gap-0.5">
                    {errors.map((message) => (
                        <div className="text-xs text-red-700" key={message}>
                            {message}
                        </div>
                    ))}
                </div>
            )}
        </MixinPrototypeCardSection>
    );
}
