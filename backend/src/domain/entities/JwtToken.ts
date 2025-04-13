interface CreateJwtTokenContract {
    value: string;
    expiryDate: Date;
}

class JwtToken {
    private constructor(public value: string, public expiryDate: Date) {}

    public static executeCreate(contract: CreateJwtTokenContract): JwtToken {
        return new JwtToken(contract.value, contract.expiryDate);
    }

    public isValid(): boolean {
        return this.expiryDate < new Date()
    }
}

export default JwtToken;