import { blockBodyScroll, unblockBodyScroll } from './Utils';

const scrollLocks = new Set<symbol>();

export function lockBodyScroll(): () => void {
    const lock = Symbol();

    if (!scrollLocks.size) blockBodyScroll();
    scrollLocks.add(lock);

    return () => {
        if (scrollLocks.delete(lock) && !scrollLocks.size) unblockBodyScroll();
    };
}
