import JwtToken from "domain/entities/JwtToken";

export default class UnitTestMixin {
    public static createJwtToken(seed: number) {
        return JwtToken.executeCreate({ expiryDate: new Date(), userId: `${seed}`, value: `${seed}` });
    } 
}