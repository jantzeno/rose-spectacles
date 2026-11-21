import PrimeVue from '../config/Config';
import { mount } from '@vue/test-utils';
import Dialog from './Dialog.vue';

describe('Dialog.vue', () => {
    it('is Dialog element exist', async () => {
        const wrapper = mount(Dialog, {
            global: {
                plugins: [PrimeVue],
                stubs: {
                    teleport: true,
                    transition: false
                }
            },
            props: {
                visible: false
            },
            data() {
                return {
                    containerVisible: true
                };
            }
        });

        expect(wrapper.find('.rs-dialog.rs-component').exists()).toBe(false);

        await wrapper.setProps({ visible: true });

        expect(wrapper.find('.rs-dialog.rs-component').exists()).toBe(true);
    });

    it('slot checks', async () => {
        const wrapper = mount(Dialog, {
            global: {
                plugins: [PrimeVue],
                stubs: {
                    teleport: true
                }
            },
            slots: {
                default: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>',
                footer: '<p>Dialog Footer</p>'
            },
            data() {
                return {
                    containerVisible: true
                };
            }
        });

        await wrapper.setProps({ visible: true });

        expect(wrapper.find('.rs-dialog-content').exists()).toBe(true);
        expect(wrapper.find('.rs-dialog-footer').exists()).toBe(true);
    });

    it('restores document text selection when unmounted during a drag', async () => {
        const wrapper = mount(Dialog, { props: { appendTo: 'self', header: 'Move me', visible: true } });

        try {
            await wrapper.get('.rs-dialog-header').trigger('mousedown', { clientX: 20, clientY: 20 });
            expect(document.body.getAttribute('data-p-unselectable-text')).toBe('true');

            wrapper.unmount();

            expect(document.body.hasAttribute('data-p-unselectable-text')).toBe(false);
            expect(document.body.style.userSelect).toBe('');
        } finally {
            document.body.removeAttribute('data-p-unselectable-text');
            document.body.style.userSelect = '';
        }
    });
});

describe('closable', () => {
    it('should have custom close icon when provided', async () => {
        const wrapper = mount(Dialog, {
            global: {
                plugins: [PrimeVue],
                stubs: {
                    teleport: true
                }
            },
            props: {
                closable: true,
                closeIcon: 'pi pi-discord',
                showHeader: true,
                visible: false
            },
            data() {
                return {
                    containerVisible: true
                };
            }
        });

        await wrapper.setProps({ visible: true });

        const icon = wrapper.find('.rs-dialog-close-button .rs-button-icon');

        expect(icon.classes()).toContain('pi-discord');
    });
});

describe('maximizable', () => {
    it('should have custom maximize and minimize icons when provided', async () => {
        const wrapper = mount(Dialog, {
            global: {
                plugins: [PrimeVue],
                stubs: {
                    teleport: true
                }
            },
            props: {
                maximizable: true,
                maximizeIcon: 'pi pi-discord',
                minimizeIcon: 'pi pi-facebook',
                showHeader: true,
                visible: false
            },
            data() {
                return {
                    containerVisible: true
                };
            }
        });

        await wrapper.setProps({ visible: true });
        await wrapper.setData({ maximized: false });

        let icon = wrapper.find('.rs-dialog-maximize-button .rs-button-icon');

        expect(icon.classes()).toContain('pi-discord');

        await wrapper.setData({ maximized: true });

        icon = wrapper.find('.rs-dialog-maximize-button .rs-button-icon');

        expect(icon.classes()).toContain('pi-facebook');
    });
});
