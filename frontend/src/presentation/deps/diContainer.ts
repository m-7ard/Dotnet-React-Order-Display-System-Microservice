import IRouterContext from "../routes/interfaces/IRouterContext";

type TokenType<T> = T extends { __service: infer S } ? S : never;

type TokenMap = typeof DI_TOKENS;
type TokenKeys = keyof TokenMap;
type TokenValues = TokenMap[TokenKeys];

type Factory<T = unknown> = (container: DIContainer) => T;

type Registration<T = unknown> = { type: "instance"; value: T } | { type: "factory"; value: Factory<T> };

const makeToken = <Service>(literal: string) => literal as string & { __service: Service };

export const DI_TOKENS = {
    ROUTER_CONTEXT: makeToken<IRouterContext>("ROUTER_CONTEXT"),
} as const;

export class DIContainer {
    private dependencies = new Map<string, Registration<unknown>>();

    register<K extends TokenValues>(token: K, instance: TokenType<K>): void {
        this.dependencies.set(token as string, {
            type: "instance",
            value: instance,
        });
    }

    registerFactory<K extends TokenValues>(token: K, factory: Factory<TokenType<K>>): void {
        this.dependencies.set(token as string, {
            type: "factory",
            value: factory,
        });
    }

    // registerSingleton<K extends TokenValues>(token: K, factory: Factory<TokenType<K>>): void {
    //     let instance: TokenType<K> | undefined;
    //     this.dependencies.set(token as string, {
    //         type: "factory",
    //         value: (container: DIContainer) => {
    //             if (!instance) {
    //                 instance = factory(container);
    //             }
    //             return instance;
    //         },
    //     });
    // }

    resolve<K extends TokenValues>(token: K): TokenType<K> {
        const registration = this.dependencies.get(token as string);

        if (!registration) {
            throw new Error(`Dependency not registered: ${token}`);
        }

        switch (registration.type) {
            case "instance":
                return registration.value as TokenType<K>;
            case "factory":
                return registration.value(this) as TokenType<K>;
            default:
                throw new Error(`Missing registration for: ${token}`);
        }
    }
}

const diContainer = new DIContainer();

export default diContainer;
