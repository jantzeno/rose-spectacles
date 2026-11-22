import { mount, type VueWrapper } from '@vue/test-utils';
import { h } from 'vue';
import AccordionContent from '../accordioncontent/AccordionContent.vue';
import AccordionHeader from '../accordionheader/AccordionHeader.vue';
import AccordionPanel from '../accordionpanel/AccordionPanel.vue';
import Accordion from './Accordion.vue';

describe('Accordion', () => {
    let wrapper: VueWrapper;

    beforeEach(() => {
        wrapper = mount(Accordion, {
            slots: {
                default: () =>
                    ['Field notes', 'Details', 'Review'].map((label, index) =>
                        h(AccordionPanel, { key: label, value: index }, () => [
                            h(AccordionHeader, {}, () => label),
                            h(AccordionContent, {}, () => `${label} content`)
                        ])
                    )
            }
        });
    });

    afterEach(() => wrapper.unmount());

    it('renders the headers of its AccordionPanel children', () => {
        expect(wrapper.findAll('button.rs-accordionheader').map((button) => button.text())).toEqual(['Field notes', 'Details', 'Review']);
    });

    it('activates the matching panel when its value changes', async () => {
        await wrapper.setProps({ value: 1 });

        const headers = wrapper.findAll('button.rs-accordionheader');
        expect(headers.map((header) => header.attributes('aria-expanded'))).toEqual(['false', 'true', 'false']);
    });

    it('emits the panel value when a header is clicked', async () => {
        const header = wrapper.get('button.rs-accordionheader');
        await header.trigger('click');

        expect(wrapper.emitted('update:value')).toEqual([[0]]);
        expect(header.attributes('aria-expanded')).toBe('true');
    });
});
