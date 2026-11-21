import { h } from 'vue';
import { demo, example, menu, sample, type Example } from './shared';

const items = [...menu.map((item) => ({ label: item.label })), { label: 'Archive', items: [{ label: '2026' }] }];

export const display: Example[] = [
    sample('Avatar', { label: 'RS', shape: 'circle' }),
    example(
        'Avatar group',
        ['AvatarGroup'],
        () => () => demo('AvatarGroup', {}, () => ['RS', 'KD', 'MW'].map((label) => demo('Avatar', { key: label, label, shape: 'circle' })))
    ),
    sample('Badge', { value: '3', severity: 'info' }),
    example('Overlay badge', ['OverlayBadge'], () => () => demo('OverlayBadge', { value: '3' }, () => demo('Avatar', { label: 'RS', shape: 'circle' }))),
    sample('Chip', { label: 'Field notes', removable: true }),
    sample('Tag', { value: 'Ready for review', severity: 'success' }),
    sample('Message', { severity: 'success' }, 'Field notes saved.'),
    sample('InlineMessage', { severity: 'info' }, 'Review the changes.'),
    sample('ProgressBar', { value: 58 }),
    sample('ProgressSpinner', { 'aria-label': 'Saving notes', style: { width: '44px', height: '44px' } }),
    sample('MeterGroup', {
        value: [
            { label: 'Draft', value: 30, color: '#a73d5c' },
            { label: 'Review', value: 25, color: '#487782' }
        ]
    }),
    sample('Breadcrumb', { home: { label: 'Home' }, model: [{ label: 'Journal' }, { label: 'Field notes' }] }),
    sample('Menu', { model: items }),
    sample('Menubar', { model: items }),
    sample('MegaMenu', { model: [{ label: 'Journal', items: [[{ label: 'Entries', items: [{ label: 'Field notes' }] }]] }] }),
    sample('PanelMenu', { model: items }),
    sample('TieredMenu', { model: items }),
    sample('TabMenu', { model: menu }),
    sample('Steps', { model: menu, activeStep: 1 }),
    example(
        'Dock',
        ['Dock'],
        () => () =>
            demo(
                'Dock',
                { model: menu, position: 'bottom', style: { position: 'relative', minHeight: '4rem' } },
                {
                    icon: ({ item }: { item: { label: string } }) => h('span', item.label.slice(0, 1))
                }
            )
    )
];
