import IOrderApiModel from "../../../apiModels/IOrderApiModel";

type IMarkOrderFinishedResponseDTO = {
    orderId: IOrderApiModel["id"];
    dateFinished: string;
};

export default IMarkOrderFinishedResponseDTO;
