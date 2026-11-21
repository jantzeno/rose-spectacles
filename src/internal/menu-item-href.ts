const unsafeNavigationProtocols = new Set(['javascript:', 'vbscript:', 'data:']);

export function menuItemHref(value: unknown): string | undefined {
    if (typeof value !== 'string') return undefined;

    try {
        const { protocol } = new URL(value, 'https://menu.invalid');

        return unsafeNavigationProtocols.has(protocol) ? undefined : value;
    } catch {
        return undefined;
    }
}
