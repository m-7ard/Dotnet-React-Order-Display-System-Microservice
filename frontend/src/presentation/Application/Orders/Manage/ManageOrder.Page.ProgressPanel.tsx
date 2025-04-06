import Order from "../../../../domain/models/Order";
import { useGlobalDialogPanelContext } from "../../../components/Dialog/GlobalDialog.Panel.Context";
import Divider from "../../../components/Resuables/Divider";
import MixinButton from "../../../components/Resuables/MixinButton";
import { PolymorphicMixinPanel, PolymorphicMixinPanelSection } from "../../../components/Resuables/MixinPanel";

export default function OrderProgressPanel(props: { order: Order }) {
    const { order } = props;
    const { onClose } = useGlobalDialogPanelContext();

    return (
        <PolymorphicMixinPanel exp={(options) => ({ hasBorder: true, hasShadow: true, size: options.SIZE.BASE, theme: options.THEMES.GENERIC_WHITE })}>
            <PolymorphicMixinPanelSection className="flex flex-row justify-between items-center">
                <div className="token-base-title">Order #{order.serialNumber} Progress</div>
                <MixinButton
                    options={{
                        size: "mixin-button-sm",
                        theme: "theme-button-generic-white",
                    }}
                    onClick={onClose}
                    type="button"
                    hasShadow
                >
                    Close
                </MixinButton>
            </PolymorphicMixinPanelSection>
            <Divider />
            <PolymorphicMixinPanelSection className="flex flex-col gap-3">
                <div className="token-default-list">
                    <div className="token-default-list__label">Date Created</div>
                    <div className="token-default-list__value">{order.dateCreated.toLocaleString("en-us")}</div>
                </div>
                <div className="token-default-list">
                    <div className="token-default-list__label">Date Finished</div>
                    <div className="token-default-list__value">{order.dateFinished == null ? "N/A" : order.dateFinished.toLocaleString("en-us")}</div>
                </div>
            </PolymorphicMixinPanelSection>
        </PolymorphicMixinPanel>
    );
}
