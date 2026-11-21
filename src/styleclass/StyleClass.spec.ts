import { config, mount } from '@vue/test-utils';
import Button from '../button/Button.vue';
import InputText from '../inputtext/InputText.vue';
import StyleClass from './StyleClass';

config.global.directives = {
    styleclass: StyleClass
};

describe('StyleClass', () => {
    it('hides a statically positioned target after an outside click', async () => {
        const wrapper = mount(
            {
                template: `
                    <div>
                        <button v-styleclass="{
                            selector: '@next',
                            enterFromClass: 'surface-hidden',
                            leaveToClass: 'surface-hidden',
                            hideOnOutsideClick: true
                        }">Show</button>
                        <div class="surface-hidden" data-testid="surface" style="position: static">Content</div>
                        <button data-testid="outside">Outside</button>
                    </div>
                `
            },
            { attachTo: document.body }
        );
        const surface = wrapper.get<HTMLElement>('[data-testid="surface"]');
        Object.defineProperty(surface.element, 'offsetParent', {
            get: () => (surface.classes().includes('surface-hidden') ? null : document.body)
        });

        try {
            await wrapper.get('button').trigger('click');
            expect(surface.classes()).not.toContain('surface-hidden');
            await surface.trigger('click');
            expect(surface.classes()).not.toContain('surface-hidden');
            await wrapper.get('[data-testid="outside"]').trigger('click');
            expect(surface.classes()).toContain('surface-hidden');
        } finally {
            wrapper.unmount();
        }
    });

    it('should work with next selector', async () => {
        const wrapper = mount({
            template: `
                <Button label="Toggle rs-disabled" v-styleclass="{ selector: '@next', toggleClass: 'rs-disabled' }" />
                <InputText class="block mt-3" />
            `,
            components: {
                Button,
                InputText
            }
        });

        const button = wrapper.find('.rs-button');
        const input = wrapper.find('.rs-inputtext');

        expect(input.classes()).not.toContain('rs-disabled');

        await button.trigger('click');

        expect(input.classes()).toContain('rs-disabled');

        await button.trigger('click');

        expect(input.classes()).not.toContain('rs-disabled');
    });
});
