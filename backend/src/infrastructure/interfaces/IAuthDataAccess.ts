interface IAuthDataAccess {
    validateToken(value: string): Promise<Response>;
    logout(token: string): Promise<Response>;
}

export default IAuthDataAccess;
