import { AsyncLocalStorage } from "async_hooks";

type TokenType<T> = T extends { __service: infer S } ? S : never;

type TokenMap = typeof DI_TOKENS;
type TokenKeys = keyof TokenMap;
type TokenValues = TokenMap[TokenKeys];

type Factory<T = unknown> = (container: ProductionDIContainer) => T;

type ScopeId = string;
type ScopeFactory<T> = (container: ProductionDIContainer, scopeId: ScopeId) => T; // We don't really need the scopeId

type Registration<T = unknown> = { type: "instance"; value: T } | { type: "factory"; value: Factory<T> } | { type: "scoped"; value: ScopeFactory<T> };

const makeToken = <Service>(literal: string) => literal as string & { __service: Service };

export const DI_TOKENS = {
} as const;

const scopeContext = new AsyncLocalStorage<Map<string, unknown>>();

class UnregisteredDependencyError extends Error {};

export interface IDIContainer {
    register<K extends TokenValues>(token: K, instance: TokenType<K>): void;
    registerFactory<K extends TokenValues>(token: K, factory: Factory<TokenType<K>>): void;
    registerScoped<K extends TokenValues>(token: K, factory: ScopeFactory<TokenType<K>>): void;
    registerScopedInstance<K extends TokenValues>(token: K, instance: TokenType<K>): void;
    resolve<K extends TokenValues>(token: K): TokenType<K>;
    runInScope<T>(fn: () => T): T;
    getCurrentScopeId(): ScopeId | undefined
}

export class ProductionDIContainer implements IDIContainer {
    protected dependencies = new Map<string, Registration<unknown>>();
    protected scopedInstances = new Map<ScopeId, Map<string, unknown>>();

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

    registerScoped<K extends TokenValues>(token: K, factory: ScopeFactory<TokenType<K>>): void {
        this.dependencies.set(token as string, {
            type: "scoped",
            value: factory,
        });
    }

    getCurrentScopeId(): ScopeId | undefined {
        const store = scopeContext.getStore();
        if (!store) return undefined;
        return store.get("scopeId") as ScopeId | undefined;
    }

    registerScopedInstance<K extends TokenValues>(token: K, instance: TokenType<K>): void {
        const scopeId = this.getCurrentScopeId();
        if (!scopeId) {
            throw new Error(`Cannot register scoped instance outside of a scope: ${token}`);
        }

        // Get or create the scope's instance map
        if (!this.scopedInstances.has(scopeId)) {
            this.scopedInstances.set(scopeId, new Map());
        }

        const scopeMap = this.scopedInstances.get(scopeId)!;
        scopeMap.set(token as string, instance);
    }

    resolve<K extends TokenValues>(token: K): TokenType<K> {
        const scopeId = this.getCurrentScopeId();
        
        // If we're in a scope, check for scope-specific instances first
        if (scopeId && this.scopedInstances.has(scopeId)) {
            const scopeMap = this.scopedInstances.get(scopeId)!;
            if (scopeMap.has(token as string)) {
                return scopeMap.get(token as string) as TokenType<K>;
            }
        }
        
        // Fall back to the global registration logic
        const registration = this.dependencies.get(token as string);

        if (!registration) {
            throw new UnregisteredDependencyError(`Dependency not registered: ${token}`);
        }

        switch (registration.type) {
            case "instance":
                return registration.value as TokenType<K>;

            case "factory":
                return registration.value(this) as TokenType<K>;

            case "scoped": {
                if (!scopeId) {
                    throw new UnregisteredDependencyError(`Cannot resolve scoped dependency outside of a scope: ${token}`);
                }

                // Get or create instance map for this scope
                if (!this.scopedInstances.has(scopeId)) {
                    this.scopedInstances.set(scopeId, new Map());
                }

                const scopeMap = this.scopedInstances.get(scopeId)!;

                // Create and store new instance
                const instance = registration.value(this, scopeId) as TokenType<K>;
                scopeMap.set(token as string, instance);
                return instance;
            }

            default:
                throw new Error(`Unknown registration type for: ${token}`);
        }
    }

    runInScope<T>(fn: () => T): T {
        const scopeId = `scope-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const store = new Map<string, unknown>([["scopeId", scopeId]]);

        try {
            return scopeContext.run(store, () => fn());
        } finally {
            // Clean up instances when scope ends
            this.scopedInstances.delete(scopeId);
        }
    }
}

export class TestingDIContainer extends ProductionDIContainer {
    private __testResolveFlag: boolean = false;
    private readonly testingDependencies = new Map<string, unknown>();

    constructor() {
        super();
    }

    resolve<K extends TokenValues>(token: K): TokenType<K> {
        try {
            return super.resolve(token);
        } catch (err: unknown) {
            if (err instanceof UnregisteredDependencyError) {
                if (!this.__testResolveFlag) throw new Error(err.message);
                const dependency = this.testingDependencies.get(token);
                if (dependency == null) throw new Error("Testing dependency does not exist.");
                return dependency as TokenType<K>;
            }

            throw err;
        }
    }

    testResolve<K extends TokenValues>(token: K): TokenType<K> {
        this.__testResolveFlag = true;
        const dependency = this.resolve(token);
        this.__testResolveFlag = false;
        return dependency;
    }
}
