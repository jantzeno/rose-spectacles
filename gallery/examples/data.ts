import { h, ref } from 'vue';
import { demo, example, locations, onePixel, sample, tree, type Example } from './shared';

type LocationSlot = { item: (typeof locations)[number] };
const details = (location: (typeof locations)[number]) => h('p', [h('strong', location.name), ` · ${location.country}`]);
const album = [
    { title: 'Daybreak', background: '#a76572' },
    { title: 'Embers', background: '#bb774d' },
    { title: 'Sea glass', background: '#487782' }
];
const print = (entry: (typeof album)[number]) => h('div', { class: 'print', style: { backgroundColor: entry.background } }, entry.title);

export const data: Example[] = [
    example(
        'DataTable columns',
        ['DataTable', 'Column', 'ColumnGroup', 'Row'],
        () => () =>
            demo('DataTable', { value: locations, dataKey: 'name', stripedRows: true }, () => [
                demo('ColumnGroup', { type: 'header' }, () =>
                    demo('Row', {}, () => [
                        demo('Column', { header: 'Location', field: 'name', sortable: true }),
                        demo('Column', { header: 'Country', field: 'country', sortable: true })
                    ])
                ),
                demo('Column', { field: 'name' }),
                demo('Column', { field: 'country' })
            ])
    ),
    example(
        'Data view',
        ['DataView'],
        () => () => demo('DataView', { value: locations, paginator: true, rows: 2 }, { list: ({ items }: { items: typeof locations }) => items.map(details) })
    ),
    example('Order list', ['OrderList'], () => {
        const items = ref([...locations]);
        return () =>
            demo(
                'OrderList',
                { dataKey: 'name', modelValue: items.value, 'onUpdate:modelValue': (next: typeof locations) => (items.value = next) },
                {
                    option: ({ option }: { option: LocationSlot['item'] }) => option.name
                }
            );
    }),
    example('Pick list', ['PickList'], () => {
        const items = ref([locations.slice(0, 2), locations.slice(2)]);
        return () =>
            demo(
                'PickList',
                { dataKey: 'name', modelValue: items.value, 'onUpdate:modelValue': (next: (typeof locations)[]) => (items.value = next) },
                {
                    sourceheader: () => 'Available',
                    targetheader: () => 'Selected',
                    option: ({ option }: { option: LocationSlot['item'] }) => option.name
                }
            );
    }),
    sample('Tree', { value: tree, selectionMode: 'single', filter: true }),
    example(
        'Tree table',
        ['TreeTable'],
        () => () =>
            demo('TreeTable', { value: tree }, () => [
                demo('Column', { field: 'title', header: 'Name', expander: true }),
                demo('Column', { field: 'type', header: 'Type' })
            ])
    ),
    example(
        'Organization chart',
        ['OrganizationChart'],
        () => () =>
            demo('OrganizationChart', {
                value: {
                    key: 'lead',
                    label: 'Coordinator',
                    expanded: true,
                    children: [
                        { key: 'editor', label: 'Editor' },
                        { key: 'reviewer', label: 'Reviewer' }
                    ]
                }
            })
    ),
    example(
        'Virtual scroller',
        ['VirtualScroller'],
        () => () =>
            demo(
                'VirtualScroller',
                { items: Array.from({ length: 100 }, (_, index) => `Field note ${index + 1}`), itemSize: 36, style: { height: '9rem' } },
                {
                    item: ({ item }: { item: string }) => h('div', { style: { height: '36px' } }, item)
                }
            )
    ),
    example(
        'Timeline',
        ['Timeline'],
        () => () => demo('Timeline', { value: ['Draft', 'Review', 'Publish'] }, { content: ({ item }: { item: string }) => h('p', item) })
    ),
    example('Paginator', ['Paginator'], () => {
        const first = ref(0);
        return () =>
            h('div', [
                demo('Paginator', { rows: 5, totalRecords: 20, first: first.value, 'onUpdate:first': (next: number) => (first.value = next) }),
                h('output', `Page ${first.value / 5 + 1}`)
            ]);
    }),
    example(
        'Carousel',
        ['Carousel'],
        () => () =>
            demo('Carousel', { value: album, numVisible: 1, numScroll: 1 }, { item: ({ data: entry }: { data: (typeof album)[number] }) => print(entry) })
    ),
    example(
        'Galleria',
        ['Galleria'],
        () => () =>
            demo(
                'Galleria',
                { value: album, numVisible: 3, showItemNavigators: true },
                {
                    item: ({ item }: { item: (typeof album)[number] }) => print(item),
                    thumbnail: ({ item }: { item: (typeof album)[number] }) => h('span', item.title)
                }
            )
    ),
    sample('Image', { src: onePixel, alt: 'Monochrome swatch', preview: true, imageClass: 'sample-image', width: '160', height: '96' }),
    example(
        'Image compare',
        ['ImageCompare'],
        () => () =>
            demo(
                'ImageCompare',
                { class: 'compare-example' },
                {
                    left: () => h('img', { src: onePixel, alt: 'Original', class: 'compare-before' }),
                    right: () => h('img', { src: onePixel, alt: 'Adjusted', class: 'compare-after' })
                }
            )
    ),
    example('Chart', ['Chart'], () => {
        const values = ref([3, 6, 4]);
        return () =>
            h('div', [
                h('button', { type: 'button', 'data-testid': 'chart-update', onClick: () => (values.value = [7, 2, 6]) }, 'Update chart'),
                demo('Chart', {
                    type: 'bar',
                    width: 440,
                    height: 180,
                    data: { labels: ['Drafts', 'In review', 'Published'], datasets: [{ label: 'Notes', backgroundColor: '#a73d5c', data: values.value }] },
                    options: { animation: false, responsive: false },
                    canvasProps: { 'aria-label': 'Field notes by status', role: 'img' }
                })
            ]);
    }),
    example('Editor', ['Editor'], () => {
        const value = ref('<p>Field notes</p>');
        return () =>
            h('div', [
                demo('Editor', { modelValue: value.value, 'onUpdate:modelValue': (next: string) => (value.value = next), editorStyle: { minHeight: '8rem' } }),
                h('output', { 'data-testid': 'editor-value' }, value.value)
            ]);
    })
];
