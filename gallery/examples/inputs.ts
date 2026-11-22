import { Search } from '@lucide/vue';
import { h, ref } from 'vue';
import { demo, example, locations, sample, tree, type ComponentName, type Example } from './shared';

function control<T>(name: ComponentName, initial: T, props: Record<string, unknown> = {}): Example {
    return example(name, [name], () => {
        const value = ref(initial);
        return () =>
            h('div', { class: 'control-example' }, [
                demo(name, {
                    'aria-label': name,
                    ...props,
                    modelValue: value.value,
                    'onUpdate:modelValue': (next: typeof value.value) => (value.value = next)
                }),
                h('output', JSON.stringify(value.value))
            ]);
    });
}

const cities = { options: locations, optionLabel: 'name', optionValue: 'name' };

export const inputs: Example[] = [
    sample('Button', { label: 'Save changes' }),
    example(
        'Button group',
        ['ButtonGroup'],
        () => () => demo('ButtonGroup', {}, () => [demo('Button', { label: 'Previous' }), demo('Button', { label: 'Next' })])
    ),
    control('InputText', 'Field notes', { placeholder: 'Title' }),
    control('Textarea', 'Observations from the first day.', { rows: 3 }),
    control('InputNumber', 42, { showButtons: true, min: 0, max: 99 }),
    control('InputMask', '', { mask: '(999) 999-9999', placeholder: '(555) 000-0000' }),
    control('InputOtp', '12', { length: 4, integerOnly: true }),
    control('InputChips', ['research', 'review'], { placeholder: 'Add tag' }),
    control('ColorPicker', 'a73d5c'),
    control('DatePicker', new Date(2026, 10, 21), { showIcon: true }),
    control('Slider', 45, { 'aria-label': 'Volume' }),
    control('Knob', 55, { min: 0, max: 100, size: 100 }),
    control('Rating', 3, { 'aria-label': 'Rating' }),
    control('ToggleSwitch', true),
    control('ToggleButton', false, { onLabel: 'Bookmarked', offLabel: 'Bookmark' }),
    control('SelectButton', 'Day', { options: ['Day', 'Week', 'Month'] }),
    control('Checkbox', true, { binary: true }),
    control('Select', 'Oslo', { ...cities, filter: true, showClear: true }),
    control('MultiSelect', ['Oslo', 'Kyoto'], { ...cities, display: 'chip' }),
    control('Listbox', 'Lima', { ...cities, filter: true }),
    control('TreeSelect', null, { options: tree, filter: true, placeholder: 'Select a folder' }),
    control('CascadeSelect', null, {
        options: [
            { name: 'Europe', cities: [{ name: 'Oslo' }] },
            { name: 'Asia', cities: [{ name: 'Kyoto' }] }
        ],
        optionLabel: 'name',
        optionGroupLabel: 'name',
        optionGroupChildren: ['cities'],
        placeholder: 'Select a city'
    }),
    example('AutoComplete', ['AutoComplete'], () => {
        const value = ref('');
        const suggestions = ref<string[]>([]);
        return () =>
            demo('AutoComplete', {
                placeholder: 'Search cities',
                modelValue: value.value,
                'onUpdate:modelValue': (next: string) => (value.value = next),
                suggestions: suggestions.value,
                onComplete: ({ query }: { query: string }) => {
                    suggestions.value = locations.map(({ name }) => name).filter((name) => name.toLowerCase().includes(query.toLowerCase()));
                }
            });
    }),
    control('Password', '', { toggleMask: true, placeholder: 'Choose a password' }),
    example('Checkbox group', ['CheckboxGroup'], () => {
        const selected = ref(['maps']);
        return () =>
            demo('CheckboxGroup', { modelValue: selected.value, name: 'downloads', 'onUpdate:modelValue': (value: string[]) => (selected.value = value) }, () =>
                ['maps', 'notes'].map((item) => h('label', { key: item }, [demo('Checkbox', { value: item }), ` ${item}`]))
            );
    }),
    example('Radio button group', ['RadioButtonGroup', 'RadioButton'], () => {
        const value = ref('Weekly');
        return () =>
            demo('RadioButtonGroup', { name: 'frequency', modelValue: value.value, 'onUpdate:modelValue': (next: string) => (value.value = next) }, () =>
                ['Daily', 'Weekly'].map((label) => h('label', { key: label }, [demo('RadioButton', { value: label }), ` ${label}`]))
            );
    }),
    example(
        'Input group',
        ['InputGroup', 'InputGroupAddon'],
        () => () =>
            demo(
                'InputGroup',
                {
                    style: {
                        '--rs-inputtext-sm-font-size': '0.875rem',
                        '--rs-inputtext-sm-padding-y': '0.25rem',
                        '--rs-inputtext-sm-padding-x': '0.5rem'
                    }
                },
                () => [
                    demo('InputGroupAddon', {}, () => 'https://'),
                    demo('InputText', {
                        size: 'small',
                        placeholder: 'example.com',
                        'aria-label': 'Domain',
                        style: { paddingBlock: 'var(--rs-inputtext-sm-padding-y)', paddingInline: 'var(--rs-inputtext-sm-padding-x)' }
                    })
                ]
            )
    ),
    example(
        'Icon field',
        ['IconField', 'InputIcon'],
        () => () =>
            demo('IconField', {}, () => [
                demo('InputIcon', {}, () => h(Search, { 'aria-hidden': 'true', size: 16 })),
                demo('InputText', { placeholder: 'Find an entry', 'aria-label': 'Search entries' })
            ])
    ),
    example(
        'Float label',
        ['FloatLabel'],
        () => () => demo('FloatLabel', {}, () => [demo('InputText', { id: 'float-title' }), h('label', { for: 'float-title' }, 'Title')])
    ),
    example(
        'Ifta label',
        ['IftaLabel'],
        () => () => demo('IftaLabel', {}, () => [demo('InputText', { id: 'ifta-title' }), h('label', { for: 'ifta-title' }, 'Title')])
    ),
    example('Form and field', ['Form', 'FormField'], () => {
        const result = ref('');
        return () =>
            demo('Form', { onSubmit: ({ values }: { values: Record<string, unknown> }) => (result.value = String(values.title ?? '')) }, () => [
                demo('FormField', { name: 'title', initialValue: 'Field journal' }, () => h('label', ['Title ', demo('InputText', { name: 'title' })])),
                demo('Button', { type: 'submit', label: 'Save' }),
                h('output', result.value)
            ]);
    }),
    sample('FileUpload', { name: 'attachment', mode: 'basic', customUpload: true, chooseLabel: 'Choose an attachment' })
];
