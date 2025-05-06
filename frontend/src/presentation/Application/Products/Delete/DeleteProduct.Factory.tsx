import IProduct from "../../../../domain/models/IProduct";
import { useGlobalDialogPanelContext } from "../../../components/Dialog/GlobalDialog.Panel.Context";
import DeleteProductController from "./DeleteProduct.Controller";

export default function DeleteProductFactory(props: { product: IProduct }) {
    const { product } = props;
    const { onClose } = useGlobalDialogPanelContext();

    return <DeleteProductController product={product} onClose={onClose} />;
}
