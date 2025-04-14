interface CreateJwtTokenContract {
    value: string;
    expiryDate: Date;
    userId: string;
}

class JwtToken {
    private constructor(public value: string, public expiryDate: Date, public userId: string) {}

    public static executeCreate(contract: CreateJwtTokenContract): JwtToken {
        return new JwtToken(contract.value, contract.expiryDate, contract.userId);
    }

    public isValid(): boolean {
        return this.expiryDate < new Date()
    }
}

export default JwtToken;