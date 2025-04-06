import Order from "../../../../domain/models/Order";

export default interface IMarkOrderFinishedRequestDTO {
    orderId: Order["id"];
}
