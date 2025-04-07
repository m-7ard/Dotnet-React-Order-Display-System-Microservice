import IAuthService from "../interfaces/services/IAuthService";
import createSafeContext from "../utils/createSafeContext";

export const [AuthServiceContext, useAuthServiceContext] = createSafeContext<IAuthService>("useAuthServiceContext must be used within AuthServiceContext.Provider");