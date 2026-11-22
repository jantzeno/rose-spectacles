import { mount, type VueWrapper } from '@vue/test-utils';
import { ThemeService } from '../internal/styled/index';
import Button from './Button.vue';

it('unregisters the scoped token listener when a styled instance unmounts', () => {
    const tokens = { root: { gap: '1rem' } };
    const wrapper = mount(Button, { props: { label: 'Scoped style', dt: tokens } });
    const reload = vi.spyOn(wrapper.vm, '_loadScopedThemeStyles');

    try {
        ThemeService.emit('theme:change', {});
        expect(reload).toHaveBeenCalledTimes(1);
        expect(reload).toHaveBeenCalledWith(tokens);
    } finally {
        wrapper.unmount();
    }

    reload.mockClear();
    ThemeService.emit('theme:change', {});
    expect(reload).not.toHaveBeenCalled();
    reload.mockRestore();
});

describe('Button.vue', () => {
    it('is Button element exist', () => {
        const wrapper = mount(Button, {
            props: {
                label: 'Submit'
            }
        });

        expect(wrapper.find('.rs-button.rs-component').exists()).toBe(true);
        expect(wrapper.find('.rs-button-label').exists()).toBe(true);
    });
});

describe('Button.vue', () => {
    it('is icon exist and right position', () => {
        const icon = 'pi pi-discord';
        const iconPos = 'right';
        const label = 'Save';
        const props = { icon, iconPos };
        let wrapper: VueWrapper<any>;

        wrapper = mount(Button, {
            props
        });

        expect(wrapper.find('.rs-button-icon-only').exists()).toBe(true);

        wrapper = mount(Button, {
            props: { ...props, label }
        });

        expect(wrapper.find('.rs-button-icon.rs-button-icon-' + iconPos).exists()).toBe(true);
    });
});

describe('Button.vue', () => {
    it('is badge working', () => {
        const badge = '5';
        const badgeClass = 'rs-badge-danger';
        const wrapper = mount(Button, {
            props: { badge, badgeClass }
        });

        expect(wrapper.find('.rs-badge').text()).toEqual(badge);
        expect(wrapper.find('.' + badgeClass).exists()).toBe(true);
    });
});

describe('Button.vue', () => {
    it('renders a decorative Lucide spinner and forwards loading icon attributes', () => {
        const wrapper = mount(Button, { props: { label: 'Checking', loading: true, pt: { loadingIcon: { class: 'loader-test' } } } });

        try {
            const icon = wrapper.get('svg.lucide-loader-circle.rs-button-loading-icon');
            expect(icon.classes()).toEqual(expect.arrayContaining(['rs-icon', 'rs-icon-spin', 'loader-test']));
            expect(icon.attributes('aria-hidden')).toBe('true');
            expect(icon.attributes('fill')).toBe('none');
            expect(wrapper.get('button').attributes('aria-label')).toBe('Checking');
        } finally {
            wrapper.unmount();
        }
    });

    it('is loading working', async () => {
        const loadingIcon = 'pi pi-discord';
        const wrapper = mount(Button, {
            props: {
                loading: false,
                loadingIcon
            }
        });

        expect(wrapper.find('.rs-disabled').exists()).toBe(false);

        await wrapper.setProps({ loading: true });
        const array = loadingIcon.split(' ');
        const lastIcon = '.' + array.join('.');

        expect(wrapper.find('.rs-button-loading').exists()).toBe(true);
        expect(wrapper.find('.rs-button-loading-icon' + lastIcon).exists()).toBe(true);

        await wrapper.setProps({ loading: false });

        expect(wrapper.find('.rs-button-loading').exists()).toBe(false);
    });
});
