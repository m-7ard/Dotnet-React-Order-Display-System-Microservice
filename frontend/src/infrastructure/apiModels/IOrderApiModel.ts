import IOrderItemApiModel from "./IOrderItemApiModel";

export default interface IOrderApiModel {
    id: string;
    total: number;
    status: string;
    dateCreated: string;
    dateFinished: string | null;
    orderItems: IOrderItemApiModel[];
    serialNumber: number;
}