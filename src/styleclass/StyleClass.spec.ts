import { config, mount } from '@vue/test-utils';
import Button from '../button/Button.vue';
import InputText from '../inputtext/InputText.vue';
import StyleClass from './StyleClass';

config.global.directives = {
    styleclass: StyleClass
};

describe('StyleClass', () => {
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
