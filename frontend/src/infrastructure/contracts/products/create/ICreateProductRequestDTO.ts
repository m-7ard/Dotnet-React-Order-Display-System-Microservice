export default interface ICreateProductRequestDTO {
    name: string;
    price: number;
    description: string;
    images: string[];
    amount: number;
}