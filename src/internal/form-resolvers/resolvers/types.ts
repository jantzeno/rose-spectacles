export interface ResolverOptions {
    sync?: boolean;
    raw?: boolean;
}

export interface ResolverResult<T> {
    values: T | unknown;
    errors: Record<string, unknown[]>;
}
