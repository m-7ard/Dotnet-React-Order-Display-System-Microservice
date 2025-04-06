import IProduct from "./IProduct";

export default class ProductHistory {
    constructor(props: { id: string; name: string; images: string[]; description: string; price: number; productId: IProduct["id"]; validFrom: Date; validTo: Date | null }) {
        this.id = props.id;
        this.name = props.name;
        this.images = props.images;
        this.description = props.description;
        this.price = props.price;
        this.productId = props.productId;
        this.validFrom = props.validFrom;
        this.validTo = props.validTo;
    }

    id: string;
    name: string;
    images: string[];
    description: string;
    price: number;
    productId: IProduct["id"];
    validFrom: Date;
    validTo: Date | null;

    isValid(): this is { validTo: Date } {
        return this.validTo != null;
    }
}
