import type { StyleClassOptions } from 'rose-spectacles/styleclass';
import type { DirectiveBinding } from 'vue';
import { addClass, getTargetElement, hasClass, isElement, removeClass } from '../internal/utils/dom/index';
import BaseStyleClass from './BaseStyleClass';

type Binding = DirectiveBinding<StyleClassOptions>;

interface StyleClassElement extends HTMLElement {
    $_pstyleclass_clicklistener?: (() => void) | null;
    $_pstyleclass_enter_animating?: boolean;
    $_pstyleclass_leave_animating?: boolean;
    $p_styleclass_enterlistener?: () => void;
    $p_styleclass_entercancellistener?: () => void;
    $p_styleclass_leavelistener?: () => void;
    $p_styleclass_leavecancellistener?: () => void;
    $p_styleclass_documentlistener?: ((event: MouseEvent) => void) | null;
    $p_styleclass_windowresizelistener?: (() => void) | null;
    $p_styleclass_resizeselector?: ReturnType<typeof getTargetElement>;
    $p_styleclass_resizeobserver?: ResizeObserver | null;
}

const StyleClass = BaseStyleClass.extend('styleclass', {
    mounted(el, binding) {
        el.setAttribute('data-pd-styleclass', 'true');

        this.bind(el, binding);
    },
    unmounted(el) {
        this.unbind(el);
    },
    methods: {
        bind(el: StyleClassElement, binding: Binding) {
            const target = getTargetElement(binding.value.selector, el) as StyleClassElement;

            this.$el = target;

            el.$_pstyleclass_clicklistener = () => {
                if (binding.value.toggleClass) {
                    if (hasClass(target, binding.value.toggleClass)) removeClass(target, binding.value.toggleClass);
                    else addClass(target, binding.value.toggleClass);
                } else {
                    if (target.offsetParent === null) this.enter(target, el, binding);
                    else this.leave(target, binding);
                }
            };

            el.addEventListener('click', el.$_pstyleclass_clicklistener);
        },
        unbind(el: StyleClassElement) {
            if (el.$_pstyleclass_clicklistener) {
                el.removeEventListener('click', el.$_pstyleclass_clicklistener);
                el.$_pstyleclass_clicklistener = null;
            }

            if (this.$el) {
                this.unbindResizeListener(this.$el);
                this.unbindDocumentListener(this.$el);
            }
        },
        enter(target: StyleClassElement, el: StyleClassElement, binding: Binding) {
            if (binding.value.enterActiveClass) {
                if (!target.$_pstyleclass_enter_animating) {
                    target.$_pstyleclass_enter_animating = true;

                    if (binding.value.enterActiveClass.includes('slidedown')) {
                        target.style.height = '0px';
                        removeClass(target, binding.value.hiddenClass || binding.value.enterFromClass);
                        target.style.maxHeight = target.scrollHeight + 'px';
                        addClass(target, binding.value.hiddenClass || binding.value.enterActiveClass);
                        target.style.height = '';
                    }

                    addClass(target, binding.value.enterActiveClass);

                    if (binding.value.enterFromClass) {
                        removeClass(target, binding.value.enterFromClass);
                    }

                    target.$p_styleclass_enterlistener = () => {
                        removeClass(target, binding.value.enterActiveClass);

                        if (binding.value.enterToClass) {
                            addClass(target, binding.value.enterToClass);
                        }

                        target.removeEventListener('animationend', target.$p_styleclass_enterlistener!);
                        target.removeEventListener('animationcancel', target.$p_styleclass_entercancellistener!);

                        if (binding.value.enterActiveClass!.includes('slidedown')) {
                            target.style.maxHeight = '';
                        }

                        target.$_pstyleclass_enter_animating = false;
                    };

                    target.$p_styleclass_entercancellistener = () => {
                        target.removeEventListener('animationcancel', target.$p_styleclass_entercancellistener!);
                        target.$_pstyleclass_enter_animating = false;
                    };

                    target.addEventListener('animationend', target.$p_styleclass_enterlistener);
                    target.addEventListener('animationcancel', target.$p_styleclass_entercancellistener);
                }
            } else {
                if (binding.value.enterFromClass) {
                    removeClass(target, binding.value.enterFromClass);
                }

                if (binding.value.enterToClass) {
                    addClass(target, binding.value.enterToClass);
                }
            }

            if (binding.value.hideOnOutsideClick) {
                this.bindDocumentListener(target, el, binding);
            }

            if (binding.value.hideOnResize) {
                this.bindResizeListener(target, el, binding);
            }
        },
        leave(target: StyleClassElement, binding: Binding) {
            if (binding.value.leaveActiveClass) {
                if (!target.$_pstyleclass_leave_animating) {
                    target.$_pstyleclass_leave_animating = true;
                    addClass(target, binding.value.leaveActiveClass);

                    if (binding.value.leaveFromClass) {
                        removeClass(target, binding.value.leaveFromClass);
                    }

                    target.$p_styleclass_leavelistener = () => {
                        removeClass(target, binding.value.leaveActiveClass);

                        if (binding.value.leaveToClass) {
                            addClass(target, binding.value.leaveToClass);
                        }

                        target.removeEventListener('animationend', target.$p_styleclass_leavelistener!);
                        target.removeEventListener('animationcancel', target.$p_styleclass_leavecancellistener!);
                        target.$_pstyleclass_leave_animating = false;
                    };

                    target.$p_styleclass_leavecancellistener = () => {
                        target.removeEventListener('animationcancel', target.$p_styleclass_leavecancellistener!);
                        target.$_pstyleclass_leave_animating = false;
                    };

                    target.addEventListener('animationend', target.$p_styleclass_leavelistener);
                    target.addEventListener('animationcancel', target.$p_styleclass_leavecancellistener);
                }
            } else {
                if (binding.value.leaveFromClass) {
                    removeClass(target, binding.value.leaveFromClass);
                }

                if (binding.value.leaveToClass) {
                    addClass(target, binding.value.leaveToClass);
                }
            }

            if (binding.value.hideOnOutsideClick) {
                this.unbindDocumentListener(target);
            }

            if (binding.value.hideOnResize) {
                this.unbindResizeListener(target);
            }
        },
        bindDocumentListener(target: StyleClassElement, el: StyleClassElement, binding: Binding) {
            if (!target.$p_styleclass_documentlistener) {
                target.$p_styleclass_documentlistener = (event) => {
                    if (!this.isVisible(target)) {
                        this.unbindDocumentListener(target);
                    } else if (this.isOutsideClick(event, target, el)) {
                        this.leave(target, binding);
                    }
                };

                target.ownerDocument.addEventListener('click', target.$p_styleclass_documentlistener);
            }
        },
        unbindDocumentListener(target: StyleClassElement) {
            if (target.$p_styleclass_documentlistener) {
                target.ownerDocument.removeEventListener('click', target.$p_styleclass_documentlistener);
                target.$p_styleclass_documentlistener = null;
            }
        },
        bindResizeListener(target: StyleClassElement, el: StyleClassElement, binding: Binding) {
            target.$p_styleclass_resizeselector = getTargetElement(binding.value.resizeSelector ?? 'window');

            if (isElement(target.$p_styleclass_resizeselector)) {
                this.bindElementResizeListener(target, binding);
            } else {
                this.bindWindowResizeListener(target, binding);
            }
        },
        unbindResizeListener(target: StyleClassElement) {
            this.unbindWindowResizeListener(target);
            this.unbindElementResizeListener(target);
        },
        bindWindowResizeListener(target: StyleClassElement, binding: Binding) {
            if (!target.$p_styleclass_windowresizelistener) {
                target.$p_styleclass_windowresizelistener = () => {
                    if (!this.isVisible(target)) {
                        this.unbindWindowResizeListener(target);
                    } else {
                        this.leave(target, binding);
                    }
                };

                target.ownerDocument.defaultView!.addEventListener('resize', target.$p_styleclass_windowresizelistener);
            }
        },
        unbindWindowResizeListener(target: StyleClassElement) {
            if (target.$p_styleclass_windowresizelistener) {
                target.ownerDocument.defaultView!.removeEventListener('resize', target.$p_styleclass_windowresizelistener);
                target.$p_styleclass_windowresizelistener = null;
            }
        },
        bindElementResizeListener(target: StyleClassElement, binding: Binding) {
            if (!target.$p_styleclass_resizeobserver && target.$p_styleclass_resizeselector) {
                let isFirstResize = true;

                target.$p_styleclass_resizeobserver = new ResizeObserver(() => {
                    if (isFirstResize) {
                        isFirstResize = false;

                        return;
                    }

                    if (this.isVisible(target)) {
                        this.leave(target, binding);
                    }
                });
                target.$p_styleclass_resizeobserver.observe(target.$p_styleclass_resizeselector as Element);
            }
        },
        unbindElementResizeListener(target: StyleClassElement) {
            if (target.$p_styleclass_resizeobserver) {
                target.$p_styleclass_resizeobserver.disconnect();
                target.$p_styleclass_resizeobserver = null;
            }
        },
        isVisible(target: StyleClassElement) {
            return target.offsetParent !== null;
        },
        isOutsideClick(event: MouseEvent, target: StyleClassElement, el: StyleClassElement) {
            const clicked = event.target as Node | null;
            return !el.isSameNode(clicked) && !el.contains(clicked) && !target.contains(clicked);
        }
    }
});

export default StyleClass;
