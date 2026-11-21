export default function focus(element: HTMLElement | null | undefined, options?: FocusOptions): void {
    if (element && document.activeElement !== element) element.focus(options);
}
