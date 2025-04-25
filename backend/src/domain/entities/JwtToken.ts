import { ok, Result } from "neverthrow";

interface CreateJwtTokenContract {
    value: string;
    expiryDate: Date;
    userId: string;
}

class JwtToken {
    private constructor(public value: string, public expiryDate: Date, public userId: string) {}

    public static canCreate(contract: CreateJwtTokenContract): Result<undefined, string> {
        return ok(undefined);
    }

    public static executeCreate(contract: CreateJwtTokenContract): JwtToken {
        const canCreate = this.canCreate(contract);
        if (canCreate.isErr()) {
            throw new Error(canCreate.error);
        }
        
        return new JwtToken(contract.value, contract.expiryDate, contract.userId);
    }

    public isValid(): boolean {
        return this.expiryDate > new Date()
    }
}

export default JwtToken;