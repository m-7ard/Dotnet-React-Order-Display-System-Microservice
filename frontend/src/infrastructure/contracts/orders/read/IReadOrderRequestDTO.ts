import Order from "../../../../domain/models/Order";

export default interface IReadOrderRequestDTO {
    id: Order["id"]
}
