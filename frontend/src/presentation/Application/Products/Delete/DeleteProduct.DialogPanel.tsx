import IProduct from "../../../../domain/models/IProduct";
import MixinButton from "../../../components/Resuables/MixinButton";
import { DeleteProductErrorSchema } from "./DeleteProduct.Controller";
import Divider from "../../../components/Resuables/Divider";
import { PolymorphicMixinPanel, PolymorphicMixinPanelSection } from "../../../components/Resuables/MixinPanel";

export default function DeleteProductDialogPanel(props: { product: IProduct; onSubmit: () => void; errors: DeleteProductErrorSchema; onClose: () => void }) {
    const { product, onSubmit, onClose } = props;

    return (
        <PolymorphicMixinPanel
            as="form"
            exp={(options) => ({ hasBorder: true, hasShadow: true, size: options.SIZE.BASE, theme: options.THEMES.GENERIC_WHITE })}
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
        >
            <PolymorphicMixinPanelSection className="flex flex-row justify-between items-center">
                <MixinButton
                    options={{
                        size: "mixin-button-sm",
                        theme: "theme-button-generic-white",
                    }}
                    onClick={onClose}
                    type="button"
                >
                    Close
                </MixinButton>
            </PolymorphicMixinPanelSection>
            <Divider />
            <PolymorphicMixinPanelSection className="flex flex-col gap-3 text-sm">
                Do you wish to delete "{product.name}"? This Process cannot be undone
            </PolymorphicMixinPanelSection>
            <Divider />
            <PolymorphicMixinPanelSection className="flex flex-row gap-3">
                <MixinButton onClick={onClose} className="basis-1/2 justify-center" options={{ size: "mixin-button-base", theme: "theme-button-generic-white" }} type="button">
                    Cancel
                </MixinButton>
                <MixinButton className="basis-1/2 justify-center" options={{ size: "mixin-button-base", theme: "theme-button-generic-red" }} type="submit">
                    Delete
                </MixinButton>
            </PolymorphicMixinPanelSection>
        </PolymorphicMixinPanel>
    );
}
