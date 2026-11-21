import { getScrollableParents } from '../../internal/utils/dom/index';

export default class ConnectedOverlayScrollHandler {
    element: Element | null;
    listener: EventListener | null;
    scrollableParents: Element[] | null = null;

    constructor(element: Element, listener: EventListener = () => {}) {
        this.element = element;
        this.listener = listener;
    }

    bindScrollListener() {
        if (!this.element || !this.listener) return;

        this.scrollableParents = getScrollableParents(this.element);

        for (let i = 0; i < this.scrollableParents.length; i++) {
            this.scrollableParents[i].addEventListener('scroll', this.listener);
        }
    }

    unbindScrollListener() {
        if (this.scrollableParents && this.listener) {
            for (let i = 0; i < this.scrollableParents.length; i++) {
                this.scrollableParents[i].removeEventListener('scroll', this.listener);
            }
        }
    }

    destroy() {
        this.unbindScrollListener();
        this.element = null;
        this.listener = null;
        this.scrollableParents = null;
    }
}
