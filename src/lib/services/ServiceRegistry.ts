/**
 * ServiceRegistry — lazy singleton map for all application services.
 *
 * Usage:
 *   ServiceRegistry.register('enrollment', () => new EnrollmentService());
 *   const svc = ServiceRegistry.get<EnrollmentService>('enrollment');
 */
type ServiceFactory<T> = () => T;

class ServiceRegistryClass {
    private readonly factories = new Map<string, ServiceFactory<unknown>>();
    private readonly instances = new Map<string, unknown>();

    /** Register a factory. Replaces any existing registration. */
    register<T>(key: string, factory: ServiceFactory<T>): void {
        this.factories.set(key, factory as ServiceFactory<unknown>);
        // Clear cached instance so next get() re-instantiates
        this.instances.delete(key);
    }

    /**
     * Get a service by key (lazy instantiation — factory only called once).
     * Throws if no factory registered for the key.
     */
    get<T>(key: string): T {
        if (!this.instances.has(key)) {
            const factory = this.factories.get(key);
            if (!factory) {
                throw new Error(`ServiceRegistry: no factory registered for "${key}"`);
            }
            this.instances.set(key, factory());
        }
        return this.instances.get(key) as T;
    }

    /** Check whether a key is registered. */
    has(key: string): boolean {
        return this.factories.has(key);
    }

    /** Clear a specific instance (force re-instantiation on next get). */
    reset(key: string): void {
        this.instances.delete(key);
    }

    /** Clear all instances (useful in tests). */
    resetAll(): void {
        this.instances.clear();
    }
}

export const ServiceRegistry = new ServiceRegistryClass();
