import { Boxes, ChartNoAxesCombined, ClipboardList, Package, Search, ShoppingBag, Users } from '@lucide/vue';
import { h, onUnmounted, ref } from 'vue';
import type { AppSidebarGroup, AttachmentItemStatus, CommandPaletteItem } from 'rose-spectacles';
import { demo, example, type Example } from '../shared';
import OrdersInventory from './OrdersInventory.vue';
import ProductDiscovery from './ProductDiscovery.vue';
import ProductVariants from './ProductVariants.vue';
import './commerce.css';

const navGroups: AppSidebarGroup[] = [
    {
        label: 'Store',
        items: [
            { id: 'orders', label: 'Orders', icon: ClipboardList },
            { id: 'products', label: 'Products', icon: Boxes },
            { id: 'customers', label: 'Customers', icon: Users }
        ]
    },
    { label: 'Reporting', items: [{ id: 'reports', label: 'Reports', icon: ChartNoAxesCombined }] }
];

const commands: CommandPaletteItem[] = [
    { id: 'orders', group: 'Navigate', icon: ClipboardList, label: 'Find an order', description: 'Open order search', keywords: ['sales', 'fulfillment'] },
    { id: 'products', group: 'Navigate', icon: Search, label: 'Search products', description: 'Look up a product by name or SKU' },
    { id: 'create', group: 'Actions', icon: Package, label: 'Create a product', description: 'Start a catalog listing' },
    { id: 'export', group: 'Actions', icon: ClipboardList, label: 'Export orders', description: 'Unavailable while an export is running', disabled: true }
];

export const commerce: Example[] = [
    example(
        'Empty State',
        ['EmptyState'],
        () => () =>
            demo(
                'EmptyState',
                { title: 'Your bag is empty', description: 'Browse the catalog to find something for your next trip.' },
                {
                    icon: () => h(ShoppingBag, { size: 24 }),
                    actions: () => demo('Button', { as: 'a', href: '#product-discovery', label: 'Browse products' })
                }
            )
    ),
    example('App Sidebar', ['AppSidebar'], () => {
        const active = ref('orders');
        return () =>
            demo(
                'AppSidebar',
                {
                    groups: navGroups,
                    title: 'Store admin',
                    activeId: active.value,
                    'onUpdate:activeId': (id: string) => {
                        active.value = id;
                    }
                },
                () =>
                    h('div', { class: 'commerce-sidebar-content' }, [
                        h('h2', navGroups.flatMap(({ items }) => items).find(({ id }) => id === active.value)?.label),
                        active.value === 'orders'
                            ? demo('Button', { as: 'a', href: '#orders-and-inventory', label: 'Open orders and inventory', text: true })
                            : h('p', { class: 'commerce-quiet' }, 'You selected this section from the store navigation.')
                    ])
            );
    }),
    example('Command Palette', ['CommandPalette'], () => {
        const visible = ref(false);
        const selected = ref('');
        return () =>
            h('div', { class: 'commerce-command-example' }, [
                demo('Button', {
                    label: 'Open command palette',
                    onClick: () => {
                        visible.value = true;
                    }
                }),
                h('kbd', 'Ctrl/⌘ K'),
                h('p', { role: 'status' }, selected.value ? 'Selected: ' + selected.value : ''),
                demo('CommandPalette', {
                    items: commands,
                    visible: visible.value,
                    shortcut: true,
                    'onUpdate:visible': (open: boolean) => {
                        visible.value = open;
                    },
                    onSelect: (item: CommandPaletteItem) => {
                        selected.value = item.label;
                    }
                })
            ]);
    }),
    example('Attachment Item', ['AttachmentItem'], () => {
        const status = ref<AttachmentItemStatus>('error');
        const removed = ref(false);
        let timer: ReturnType<typeof setTimeout> | undefined;
        onUnmounted(() => clearTimeout(timer));
        return () =>
            h('div', { class: 'commerce-attachments' }, [
                demo('AttachmentItem', { name: 'Packing list.txt', size: 2048, url: 'data:text/plain,Canvas%20Weekender%20%7C%201%20unit' }),
                removed.value
                    ? demo('Button', {
                          label: 'Restore attachment',
                          text: true,
                          onClick: () => {
                              removed.value = false;
                          }
                      })
                    : demo('AttachmentItem', {
                          name: 'Delivery instructions.txt',
                          size: 1180,
                          status: status.value,
                          progress: 64,
                          error: 'The sample upload was interrupted.',
                          url: 'data:text/plain,Leave%20with%20the%20front%20desk',
                          removable: true,
                          retryable: true,
                          onRemove: () => {
                              removed.value = true;
                          },
                          onRetry: () => {
                              status.value = 'uploading';
                              timer = setTimeout(() => {
                                  status.value = 'ready';
                              }, 800);
                          }
                      })
            ]);
    }),
    example(
        'Metric Card',
        ['MetricCard'],
        () => () =>
            h('div', { class: 'commerce-metrics' }, [
                demo(
                    'MetricCard',
                    {
                        label: 'Gross revenue',
                        value: '$18,420',
                        trend: { direction: 'up', tone: 'positive', label: '+12.4%' },
                        description: 'vs. last week'
                    },
                    {
                        icon: () => h(ChartNoAxesCombined, { size: 19 }),
                        chart: () =>
                            demo('Chart', {
                                type: 'line',
                                height: 70,
                                data: {
                                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                                    datasets: [{ data: [5, 7, 6, 9, 9, 11, 14], borderColor: '#8c2d4a' }]
                                },
                                options: { legend: false, xAxis: false, yAxis: false, tooltip: false },
                                containerProps: { 'aria-label': 'Revenue rose over the course of the week' }
                            })
                    }
                ),
                demo(
                    'MetricCard',
                    {
                        label: 'Open returns',
                        value: 6,
                        trend: { direction: 'down', tone: 'positive', label: '4 fewer' },
                        description: 'vs. last week'
                    },
                    { icon: () => h(Package, { size: 19 }) }
                )
            ])
    ),
    example('Product Discovery', ['DataView', 'Drawer', 'EmptyState', 'Slider', 'CheckboxGroup'], () => () => h(ProductDiscovery)),
    example('Product Variants', ['Card', 'SelectButton', 'Badge', 'Button'], () => () => h(ProductVariants)),
    example('Orders and Inventory', ['DataTable', 'MultiSelect', 'DatePicker', 'Toolbar', 'EmptyState'], () => () => h(OrdersInventory))
];
