import { addClass, createElement, hasClass, removeClass } from '../internal/utils/dom/index';
import { uuid } from '../internal/utils/uuid/index';
import BaseBadgeDirective from './BaseBadgeDirective';

interface BadgeHost extends HTMLElement {
    $_pbadgeId?: string | null;
    $_badgeValue?: string | number | null;
}

const BadgeDirective = BaseBadgeDirective.extend('badge', {
    mounted(el, binding) {
        const host = el as BadgeHost;
        console.warn('Deprecated since v4. Use OverlayBadge component instead.');
        const id = uuid('pv_id') + '_badge';

        const badge = createElement('span', {
            id,
            class: !this.isUnstyled() && this.cx('root'),
            [this.$attrSelector]: '',
            'rs-bind': this.ptm('root', {
                context: {
                    ...binding.modifiers,
                    nogutter: String(binding.value).length === 1,
                    dot: binding.value == null
                }
            })
        });

        host.$_pbadgeId = badge.getAttribute('id');

        for (let modifier in binding.modifiers) {
            !this.isUnstyled() && addClass(badge, 'rs-badge-' + modifier);
        }

        if (binding.value != null) {
            if (typeof binding.value === 'object') host.$_badgeValue = binding.value.value;
            else host.$_badgeValue = binding.value;
            badge.appendChild(document.createTextNode(host.$_badgeValue as string));

            if (String(host.$_badgeValue).length === 1 && !this.isUnstyled()) {
                !this.isUnstyled() && addClass(badge, 'rs-badge-circle');
            }
        } else {
            !this.isUnstyled() && addClass(badge, 'rs-badge-dot');
        }

        el.setAttribute('data-pd-badge', 'true');
        !this.isUnstyled() && addClass(el, 'rs-overlay-badge');
        el.setAttribute('data-p-overlay-badge', 'true');
        el.appendChild(badge);

        this.$el = badge;
    },
    updated(el, binding) {
        const host = el as BadgeHost;
        !this.isUnstyled() && addClass(el, 'rs-overlay-badge');
        el.setAttribute('data-p-overlay-badge', 'true');

        if (binding.oldValue !== binding.value) {
            let badge = document.getElementById(host.$_pbadgeId!)!;

            if (typeof binding.value === 'object') host.$_badgeValue = binding.value.value;
            else host.$_badgeValue = binding.value;

            if (!this.isUnstyled()) {
                if (host.$_badgeValue) {
                    if (hasClass(badge, 'rs-badge-dot')) removeClass(badge, 'rs-badge-dot');

                    if ((host.$_badgeValue as string).length === 1) addClass(badge, 'rs-badge-circle');
                    else removeClass(badge, 'rs-badge-circle');
                } else if (!host.$_badgeValue && !hasClass(badge, 'rs-badge-dot')) {
                    addClass(badge, 'rs-badge-dot');
                }
            }

            badge.innerHTML = '';
            badge.appendChild(document.createTextNode(host.$_badgeValue as string));
        }
    }
});

export default BadgeDirective;
