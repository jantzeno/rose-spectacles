import { mount } from '@vue/test-utils';
import { h } from 'vue';
import Step from '../step/Step.vue';
import StepList from '../steplist/StepList.vue';
import StepPanel from '../steppanel/StepPanel.vue';
import StepPanels from '../steppanels/StepPanels.vue';
import Stepper from './Stepper.vue';

it('links each Step to its StepPanel and marks the active tab after activation', async () => {
    const wrapper = mount({
        render: () => h(Stepper, { value: 'draft' }, {
            default: () => [
                h(StepList, {}, { default: () => [
                    h(Step, { value: 'draft' }, { default: () => 'Draft' }),
                    h(Step, { value: 'review' }, { default: () => 'Review' })
                ] }),
                h(StepPanels, {}, { default: () => [
                    h(StepPanel, { value: 'draft' }, { default: () => 'Write the draft.' }),
                    h(StepPanel, { value: 'review' }, { default: () => 'Review the draft.' })
                ] })
            ]
        })
    });

    try {
        const [draft, review] = wrapper.get('[role="tablist"]').findAll('[role="tab"]');
        const draftPanel = wrapper.get(`[id="${draft.attributes('aria-controls')}"]`);
        const reviewPanel = wrapper.get(`[id="${review.attributes('aria-controls')}"]`);

        expect(draft.attributes('aria-selected')).toBe('true');
        expect(review.attributes('aria-selected')).toBe('false');
        expect(draftPanel.attributes('aria-labelledby')).toBe(draft.attributes('id'));
        expect(reviewPanel.attributes('aria-labelledby')).toBe(review.attributes('id'));

        await review.trigger('click');
        expect(draft.attributes('aria-selected')).toBe('false');
        expect(review.attributes('aria-selected')).toBe('true');
        expect(reviewPanel.isVisible()).toBe(true);
        expect(reviewPanel.text()).toBe('Review the draft.');
    } finally {
        wrapper.unmount();
    }
});
