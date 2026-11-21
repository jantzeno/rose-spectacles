import { isNotEmpty } from './utils/index';

export function getValueByPath(obj: Record<string, any> | undefined, path?: string) {
    if (!obj || !path) return null;

    try {
        const value = obj[path];
        if (isNotEmpty(value)) return value;
    } catch {
        // A literal property may throw even when the nested path is readable.
    }

    const keys = path.split(/[.\[\]]+/).filter(Boolean);
    return keys.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
}
