export function getValueByPath(obj: Record<string, unknown> | undefined, path?: string, missing?: unknown): unknown {
    if (!obj || !path) return null;

    try {
        if (path in obj && Object.hasOwn(obj, path)) return obj[path];
    } catch {
        // A literal property may throw even when the nested path is readable.
    }

    let value: unknown = obj;
    const keys = path.split(/[.\[\]]+/).filter(Boolean);

    for (const key of keys) {
        if (typeof value !== 'object' || value === null || !(key in value) || !Object.hasOwn(value, key)) return missing;

        value = (value as Record<string, unknown>)[key];
    }

    return value;
}
