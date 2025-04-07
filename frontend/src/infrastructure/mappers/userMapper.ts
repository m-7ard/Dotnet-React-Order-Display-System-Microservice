import User from "../../domain/models/User";
import IUserApiModel from "../apiModels/IUserApiModel";

const userMapper = {
    apiToDomain: (source: IUserApiModel): User => {
        return new User({
            email: source.email,
            username: source.username
        });
    },
};

export default userMapper;
