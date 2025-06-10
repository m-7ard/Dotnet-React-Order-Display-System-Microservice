import { useCallback } from "react";
import IPresentationError from "../../../interfaces/IPresentationError";
import CoverImage from "../../Resuables/CoverImage";
import MixinButton from "../../Resuables/MixinButton";
import MixinPrototypeCard, { MixinPrototypeCardSection } from "../../Resuables/MixinPrototypeCard";

export type RequiredImageFormData = {
    url: string;
    originalFileName: string;
    generatedFileName: string;
};
export type GeneratedFileName = string & { _: "generatedFileName" };
export type UploadImageFormValue = Record<GeneratedFileName, RequiredImageFormData>;

export interface IImageUploadFormProps {
    onSubmit: (files: File[]) => Promise<void>;
    errors?: IPresentationError<{ [generatedFileName: GeneratedFileName]: string[] }>;
    value: UploadImageFormValue;
    onChange: (value: UploadImageFormValue) => void;
    describedBy?: string; 
    id?: string;
}

export default function UploadImagesForm(props: IImageUploadFormProps) {
    const { onChange, onSubmit, errors, value, describedBy, id } = props;

    const onDelete = useCallback(
        (generatedFileName: GeneratedFileName) => {
            const newValue = { ...value };
            delete newValue[generatedFileName];
            onChange(newValue);
        },
        [onChange, value],
    );

    async function uploadImages(event: React.ChangeEvent<HTMLInputElement>): Promise<void> {
        event.preventDefault();

        const { files } = event.target;
        if (files == null) {
            return;
        }

        await onSubmit([...files]);
        event.target.value = "";
    }

    const imageCount = Object.keys(value).length;
    const hasErrors = errors && Object.keys(errors).length > 0;

    return (
        <MixinPrototypeCard options={{ size: "mixin-Pcard-base", theme: "theme-Pcard-generic-white" }} hasBorder hasDivide>
            <MixinPrototypeCardSection>
                <MixinButton
                    className="w-fit overflow-hidden relative"
                    type="button"
                    options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}
                    aria-describedby={describedBy}
                >
                    <div className="pointer-events-none">Add Image</div>
                    <input
                        id={id}
                        type="file"
                        multiple
                        accept="image/*"
                        className="opacity-0 absolute inset-0 cursor-pointer file:cursor-pointer h-full w-full"
                        onChange={async (e) => await uploadImages(e)}
                        aria-label="Upload images"
                        aria-describedby={describedBy}
                        aria-invalid={hasErrors ? "true" : "false"}
                    />
                </MixinButton>

                {/* Screen reader only status */}
                <div className="sr-only" aria-live="polite" aria-atomic="true">
                    {imageCount === 0 ? "No images uploaded" : `${imageCount} image${imageCount === 1 ? "" : "s"} uploaded`}
                </div>
            </MixinPrototypeCardSection>

            {/* Images list with proper semantics */}
            {imageCount > 0 && (
                <MixinPrototypeCardSection role="list" aria-label="Uploaded images">
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
                </MixinPrototypeCardSection>
            )}
        </MixinPrototypeCard>
    );
}

function Image(props: { originalFileName: string; url: string; onDelete: () => void; errors?: string[] }) {
    const { originalFileName, url, onDelete, errors } = props;
    const errorId = errors?.length ? `image-${originalFileName}-error` : undefined;

    return (
        <MixinPrototypeCardSection className="flex flex-col gap-3" role="listitem">
            <div className="flex flex-row gap-3">
                <CoverImage className="w-16 h-16 min-w-16 min-h-16 border border-gray-900 overflow-hidden" src={`${url}`} alt={`Preview of ${originalFileName}`} />
                <div className="flex flex-col gap-1 overflow-hidden grow">
                    <div className="text-sm text-medium truncate" title={originalFileName}>
                        {originalFileName}
                    </div>
                    <MixinButton
                        className="ml-auto mt-auto justify-center"
                        type="button"
                        onClick={onDelete}
                        options={{ size: "mixin-button-sm", theme: "theme-button-generic-white" }}
                        aria-label={`Remove ${originalFileName}`}
                        aria-describedby={errorId}
                    >
                        Remove
                    </MixinButton>
                </div>
            </div>
            {errors?.length ? (
                <div className="flex flex-col gap-0.5" id={errorId} role="alert" aria-live="polite">
                    {errors.map((message) => (
                        <div className="text-xs text-red-700" key={message}>
                            {message}
                        </div>
                    ))}
                </div>
            ) : null}
        </MixinPrototypeCardSection>
    );
}
