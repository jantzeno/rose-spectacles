import PrimeVue from '../config/Config';
import { flushPromises, mount } from '@vue/test-utils';
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

describe('nested dialogs', () => {
    function mountDialogs(afterInnerHide?: () => void) {
        return mount(
            {
                components: { Dialog },
                props: { innerVisible: Boolean },
                setup() {
                    return { afterInnerHide };
                },
                template: `
                    <Dialog appendTo="self" header="Outer dialog" visible modal>
                        <Dialog appendTo="self" header="Inner dialog" :visible="innerVisible" modal @after-hide="afterInnerHide" />
                    </Dialog>
                `
            },
            { global: { stubs: { transition: false } } }
        );
    }

    it('dismisses only the most recently opened dialog on Escape', async () => {
        const wrapper = mountDialogs();

        try {
            await wrapper.setProps({ innerVisible: true });
            await flushPromises();

            const [outer, inner] = wrapper.findAllComponents(Dialog);
            document.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape' }));

            expect(inner.emitted('update:visible')).toEqual([[false]]);
            expect(outer.emitted('update:visible')).toBeUndefined();
        } finally {
            wrapper.unmount();
        }
    });

    it('keeps the body locked when an inner modal closes', async () => {
        let onInnerHide!: () => void;
        const innerHidden = new Promise<void>((resolve) => {
            onInnerHide = resolve;
        });
        const wrapper = mountDialogs(onInnerHide);

        try {
            await wrapper.setProps({ innerVisible: true });
            expect(document.body.classList.contains('rs-overflow-hidden')).toBe(true);

            await wrapper.setProps({ innerVisible: false });
            await innerHidden;

            expect(document.body.classList.contains('rs-overflow-hidden')).toBe(true);
        } finally {
            wrapper.unmount();
        }

        expect(document.body.classList.contains('rs-overflow-hidden')).toBe(false);
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
