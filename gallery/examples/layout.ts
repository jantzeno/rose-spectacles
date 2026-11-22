import { h, ref } from 'vue';
import { demo, example, sample, type Example } from './shared';

export const layout: Example[] = [
    example(
        'Accordion',
        ['Accordion', 'AccordionPanel', 'AccordionHeader', 'AccordionContent'],
        () => () =>
            demo('Accordion', { value: 'field' }, () =>
                demo('AccordionPanel', { value: 'field' }, () => [
                    demo('AccordionHeader', {}, () => 'Field notes'),
                    demo('AccordionContent', {}, () => 'Pine woodland and outcrops.')
                ])
            )
    ),
    example(
        'Tabs',
        ['Tabs', 'TabList', 'Tab', 'TabPanels', 'TabPanel'],
        () => () =>
            demo('Tabs', { value: 'notes' }, () => [
                demo('TabList', {}, () => [demo('Tab', { value: 'notes' }, () => 'Notes'), demo('Tab', { value: 'details' }, () => 'Details')]),
                demo('TabPanels', {}, () => [
                    demo('TabPanel', { value: 'notes' }, () => 'First observations.'),
                    demo('TabPanel', { value: 'details' }, () => 'Collected after sunrise.')
                ])
            ])
    ),
    example(
        'Horizontal stepper',
        ['Stepper', 'StepList', 'Step', 'StepPanels', 'StepPanel'],
        () => () =>
            demo('Stepper', { value: 'draft' }, () => [
                demo('StepList', {}, () => [demo('Step', { value: 'draft' }, () => 'Draft'), demo('Step', { value: 'review' }, () => 'Review')]),
                demo('StepPanels', {}, () => [
                    demo(
                        'StepPanel',
                        { value: 'draft' },
                        {
                            default: ({ activateCallback }: { activateCallback: (value: string) => void }) =>
                                demo('Button', { label: 'Review draft', onClick: () => activateCallback('review') })
                        }
                    ),
                    demo('StepPanel', { value: 'review' }, () => 'Ready to publish.')
                ])
            ])
    ),
    example(
        'Vertical stepper',
        ['StepItem'],
        () => () =>
            demo('Stepper', { value: 'draft' }, () => [
                demo('StepItem', { value: 'draft' }, () => [
                    demo('Step', { value: 'draft' }, () => 'Draft'),
                    demo('StepPanel', { value: 'draft' }, () => 'Write your notes.')
                ]),
                demo('StepItem', { value: 'review' }, () => [
                    demo('Step', { value: 'review' }, () => 'Review'),
                    demo('StepPanel', { value: 'review' }, () => 'Check your notes.')
                ])
            ])
    ),
    example(
        'Splitter',
        ['Splitter', 'SplitterPanel'],
        () => () =>
            demo('Splitter', { style: { minHeight: '7rem' } }, () => [
                demo('SplitterPanel', { size: 60 }, () => 'Document'),
                demo('SplitterPanel', { size: 40 }, () => 'Inspector')
            ])
    ),
    example(
        'Card',
        ['Card'],
        () => () => demo('Card', {}, { title: () => 'Field journal', subtitle: () => 'November', content: () => 'First observations in the north woodland.' })
    ),
    sample('Panel', { header: 'Field journal', toggleable: true }, 'Pine woodland and outcrops.'),
    sample('Fieldset', { legend: 'Travel notes', toggleable: true }, 'Pine woodland and outcrops.'),
    sample('Divider', { align: 'center' }, 'or'),
    example('Fluid', ['Fluid'], () => () => demo('Fluid', {}, () => demo('InputText', { placeholder: 'Full width', 'aria-label': 'Full width field' }))),
    example('Block content', ['BlockUI'], () => {
        const blocked = ref(false);
        return () =>
            h('div', [
                demo('Button', { label: blocked.value ? 'Unblock' : 'Block', onClick: () => (blocked.value = !blocked.value) }),
                demo('BlockUI', { blocked: blocked.value }, () => h('p', 'Editing region'))
            ]);
    }),
    example(
        'Inplace',
        ['Inplace'],
        () => () => demo('Inplace', {}, { display: () => 'Edit title', content: () => demo('InputText', { modelValue: 'Field notes', 'aria-label': 'Title' }) })
    ),
    example('Deferred content', ['DeferredContent'], () => () => demo('DeferredContent', {}, () => h('p', 'Content loaded on entry.'))),
    example(
        'Scroll panel',
        ['ScrollPanel'],
        () => () =>
            demo('ScrollPanel', { style: { height: '7rem' } }, () => Array.from({ length: 8 }, (_, index) => h('p', { key: index }, `Field note ${index + 1}`)))
    ),
    example(
        'Toolbar',
        ['Toolbar'],
        () => () => demo('Toolbar', {}, { start: () => demo('Button', { label: 'New note' }), end: () => demo('Tag', { value: 'Draft' }) })
    ),
    sample('Skeleton', { width: '12rem', height: '2rem', 'aria-label': 'Loading' })
];
