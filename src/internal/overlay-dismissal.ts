import OverlayEventBus from '../overlayeventbus/OverlayEventBus';

interface NestedOverlayPress {
    originalEvent: { type: unknown };
    target: Node;
}

function isNestedOverlayPress(event: unknown): event is NestedOverlayPress {
    return (
        typeof event === 'object' &&
        event !== null &&
        'originalEvent' in event &&
        typeof event.originalEvent === 'object' &&
        event.originalEvent !== null &&
        'type' in event.originalEvent &&
        'target' in event &&
        event.target instanceof Node
    );
}

export function isOwnedOverlayTarget(owner: Element, target: Element) {
    for (let node: Element | null = target; node && node !== owner.ownerDocument.body; node = node.parentElement) {
        for (const { name, value } of node.attributes) {
            if (value === '' && /^pc\w+$/.test(name) && owner.querySelector(`[${name}]`)) return true;
        }
    }

    const overlay = target.closest('[data-pc-section="overlay"], [data-pc-section="panel"]');
    if (!overlay || overlay.contains(owner)) return false;

    for (const trigger of owner.querySelectorAll('[aria-controls], [aria-owns]')) {
        const ids = `${trigger.getAttribute('aria-controls') ?? ''} ${trigger.getAttribute('aria-owns') ?? ''}`.trim().split(/\s+/);

        if (ids.some((id) => overlay.contains(owner.ownerDocument.getElementById(id)))) return true;
    }

    return false;
}

export function listenForOutsideOverlayClick(trigger: HTMLElement, overlay: HTMLElement, dismiss: () => void) {
    const document = trigger.ownerDocument;
    let nestedPress = false;

    const resetPress = () => {
        nestedPress = false;
    };
    const handleNestedPress = (event: unknown) => {
        // A nested Select removes its option on mousedown. Its subsequent click can land outside both overlays.
        if (isNestedOverlayPress(event) && event.originalEvent.type === 'mousedown' && overlay.contains(event.target)) {
            nestedPress = true;
        }
    };
    const handleClick = (event: MouseEvent) => {
        const path = event.composedPath();
        const inside = path.includes(trigger) || path.includes(overlay);
        const nestedExpanded = overlay.querySelector('[aria-haspopup][aria-expanded="true"]:not([role="treeitem"])');
        const shouldDismiss = !inside && !nestedPress && !nestedExpanded;

        resetPress();
        if (shouldDismiss) dismiss();
    };

    document.addEventListener('mousedown', resetPress, true);
    document.addEventListener('click', handleClick, true);
    OverlayEventBus.on('overlay-click', handleNestedPress);

    return () => {
        OverlayEventBus.off('overlay-click', handleNestedPress);
        document.removeEventListener('mousedown', resetPress, true);
        document.removeEventListener('click', handleClick, true);
    };
}
