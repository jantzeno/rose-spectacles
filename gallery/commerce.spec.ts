import { flushPromises, mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import AppSidebar from '../src/appsidebar/AppSidebar.vue';
import AttachmentItem from '../src/attachmentitem/AttachmentItem.vue';
import CommandPalette from '../src/commandpalette/CommandPalette.vue';
import EmptyState from '../src/emptystate/EmptyState.vue';
import MetricCard from '../src/metriccard/MetricCard.vue';
import Select from '../src/select/Select.vue';
import OrdersInventory from './examples/commerce/OrdersInventory.vue';
import ProductDiscovery from './examples/commerce/ProductDiscovery.vue';
import ProductVariants from './examples/commerce/ProductVariants.vue';
import { orderStorageKey } from './examples/commerce/orders';

const originalUrl = window.location.href;

afterEach(() => {
    window.history.replaceState(null, '', originalUrl);
    window.localStorage.removeItem(orderStorageKey);
});

it('names separate empty states and keeps their actions available', async () => {
    const retry = vi.fn();
    const wrapper = mount({
        render: () =>
            h('div', [
                h(
                    EmptyState,
                    { title: 'Nothing to ship', description: 'New orders will appear here.', heading: 'h3' },
                    {
                        actions: () => h('button', { type: 'button', onClick: retry }, 'Refresh')
                    }
                ),
                h(EmptyState, { title: 'No saved addresses' })
            ])
    });

    try {
        const [orders, addresses] = wrapper.findAll('section');
        expect(orders.attributes('aria-labelledby')).toBe(orders.get('h3').attributes('id'));
        expect(orders.attributes('aria-describedby')).toBe(orders.get('p').attributes('id'));
        expect(addresses.attributes('aria-labelledby')).not.toBe(orders.attributes('aria-labelledby'));
        await orders.get('button').trigger('click');
        expect(retry).toHaveBeenCalledOnce();
    } finally {
        wrapper.unmount();
    }
});

it('preserves the selected destination when the sidebar collapses or opens in a drawer', async () => {
    const wrapper = mount(AppSidebar, {
        attachTo: document.body,
        props: {
            groups: [
                {
                    label: 'Store',
                    items: [
                        { id: 'orders', label: 'Orders' },
                        { id: 'products', label: 'Products' },
                        { id: 'drafts', label: 'Drafts', disabled: true }
                    ]
                }
            ]
        }
    });

    try {
        await wrapper.get('button[aria-label="Collapse navigation"]').trigger('click');
        expect(wrapper.attributes('data-collapsed')).toBe('true');
        await wrapper.get('.rs-app-sidebar-desktop button[aria-label="Products"]').trigger('click');
        expect(wrapper.emitted('update:activeId')).toEqual([['products']]);
        expect(wrapper.get('button[aria-current="page"]').attributes('aria-label')).toBe('Products');

        await wrapper.get('button[aria-label="Open navigation"]').trigger('click');
        await flushPromises();
        const drawer = document.body.querySelector<HTMLElement>('[role="dialog"][aria-label="Workspace navigation"]');
        expect(drawer?.querySelector('button[aria-current="page"]')?.textContent).toContain('Products');

        const orders = Array.from(drawer?.querySelectorAll('nav button') ?? []).find((button) => button.textContent?.trim() === 'Orders');
        expect(orders).toBeDefined();
        orders?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await flushPromises();
        expect(wrapper.emitted('update:activeId')).toEqual([['products'], ['orders']]);
        expect(wrapper.get('button[aria-label="Open navigation"]').attributes('aria-expanded')).toBe('false');
    } finally {
        wrapper.unmount();
    }
});

it('filters commands by keyword and skips disabled results during keyboard selection', async () => {
    const wrapper = mount(CommandPalette, {
        attachTo: document.body,
        props: {
            shortcut: true,
            items: [
                { id: 'orders', label: 'Orders', keywords: ['shipping'], group: 'Navigate' },
                { id: 'drafts', label: 'Drafts', keywords: ['shipping'], group: 'Navigate', disabled: true },
                { id: 'report', label: 'Create report', keywords: ['shipping'], group: 'Actions' }
            ]
        }
    });

    try {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true, cancelable: true }));
        await flushPromises();
        const input = document.querySelector<HTMLInputElement>('input[role="combobox"]');
        expect(input).toBeTruthy();

        input!.value = 'unmatched';
        input!.dispatchEvent(new Event('input', { bubbles: true }));
        await nextTick();
        expect(document.body.querySelector('.rs-command-palette-status')?.textContent).toContain('No matching commands');

        input!.value = 'shipping';
        input!.dispatchEvent(new Event('input', { bubbles: true }));
        await nextTick();
        expect(document.getElementById(input!.getAttribute('aria-activedescendant') ?? '')?.textContent).toContain('Orders');
        input!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
        await nextTick();
        expect(document.getElementById(input!.getAttribute('aria-activedescendant') ?? '')?.textContent).toContain('Create report');

        input!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
        expect(wrapper.emitted('select')).toEqual([[expect.objectContaining({ id: 'report' })]]);
        expect(wrapper.emitted('update:visible')).toEqual([[true], [false]]);
    } finally {
        wrapper.unmount();
    }
});

it('keeps remote command results and hides stale options during loading', async () => {
    const wrapper = mount(CommandPalette, {
        attachTo: document.body,
        props: {
            visible: true,
            query: 'SKU-126',
            filterLocally: false,
            loading: true,
            items: [{ id: '1', label: 'Canvas Weekender' }]
        }
    });

    try {
        await flushPromises();
        expect(document.body.querySelector('[role="listbox"]')?.getAttribute('aria-busy')).toBe('true');
        expect(document.body.querySelector('[role="option"]')).toBeNull();
        await wrapper.setProps({ loading: false });
        expect(document.body.querySelector('[role="option"]')?.textContent).toContain('Canvas Weekender');
    } finally {
        wrapper.unmount();
    }
});

it('exposes upload progress, retry, removal, and download in the appropriate attachment states', async () => {
    const wrapper = mount(AttachmentItem, { props: { name: 'Photo.jpg', size: 1536, status: 'uploading', progress: 42, retryable: true, removable: true } });

    try {
        expect(wrapper.text()).toContain('1.5 KB');
        const progress = wrapper.get('[role="progressbar"]');
        expect(progress.attributes('aria-valuenow')).toBe('42');
        expect(progress.attributes('aria-label')).toBe('Uploading Photo.jpg');
        expect(wrapper.find('a[download]').exists()).toBe(false);

        await wrapper.setProps({ status: 'error', error: 'Upload interrupted' });
        expect(wrapper.text()).toContain('Upload interrupted');
        await wrapper.get('button[aria-label="Retry Photo.jpg"]').trigger('click');
        await wrapper.get('button[aria-label="Remove Photo.jpg"]').trigger('click');
        expect(wrapper.emitted('retry')).toEqual([[]]);
        expect(wrapper.emitted('remove')).toEqual([[]]);

        await wrapper.setProps({ status: 'ready', url: '/Photo.jpg' });
        expect(wrapper.get('a[download="Photo.jpg"]').attributes('href')).toBe('/Photo.jpg');
        expect(wrapper.find('[role="progressbar"]').exists()).toBe(false);
    } finally {
        wrapper.unmount();
    }
});

it('labels a metric, keeps trend tone independent of direction, and renders a supplied chart', () => {
    const wrapper = mount(MetricCard, {
        props: { label: 'Open returns', value: 6, trend: { label: '4 fewer', direction: 'down', tone: 'positive' } },
        slots: { chart: () => h('div', { 'data-testid': 'sparkline' }, 'Daily returns') }
    });

    try {
        expect(wrapper.get('[role="group"]').attributes('aria-labelledby')).toBe(wrapper.get('.rs-metric-card-label').attributes('id'));
        expect(wrapper.get('.rs-metric-card-value').text()).toBe('6');
        expect(wrapper.get('.rs-metric-card-trend').attributes('data-tone')).toBe('positive');
        expect(wrapper.find('.lucide-arrow-down-right').exists()).toBe(true);
        expect(wrapper.get('[data-testid="sparkline"]').text()).toBe('Daily returns');
    } finally {
        wrapper.unmount();
    }
});

it('restores catalog filters from the URL and clears them without losing unrelated state', async () => {
    window.history.replaceState(null, '', '/?catalog-category=Drinkware&catalog-stock=1&ref=newsletter#product-discovery');
    const wrapper = mount(ProductDiscovery);

    try {
        await nextTick();
        expect(wrapper.get('[role="status"]').text()).toBe('1 product');
        expect(wrapper.text()).toContain('Insulated Bottle');
        expect(wrapper.text()).not.toContain('Ribbed Wool Beanie');

        await wrapper.get('button[aria-label="Remove Drinkware"]').trigger('click');
        expect(wrapper.get('[role="status"]').text()).toBe('3 products');
        expect(new URLSearchParams(window.location.search).get('catalog-category')).toBeNull();

        await wrapper.get('input[aria-label="Search products"]').setValue('missing item');
        expect(wrapper.text()).toContain('No matching products');
        await wrapper.get('.rs-empty-state button').trigger('click');
        expect(wrapper.get('[role="status"]').text()).toBe('4 products');
        expect(window.location.search).toBe('?ref=newsletter');
        expect(window.location.hash).toBe('#product-discovery');
    } finally {
        wrapper.unmount();
    }
});

it('previews product details and picks an in-stock capacity when the color changes', async () => {
    const wrapper = mount(ProductVariants);
    try {
        await wrapper.get('[aria-label="View zipper detail"]').trigger('focus');
        expect(wrapper.get('[role="img"]').attributes('aria-label')).toContain('Olive canvas zipper');
        const clay = wrapper.findAll('button').find((button) => button.text().includes('Clay'));
        expect(clay).toBeDefined();
        await clay!.trigger('click');
        expect(wrapper.get('[role="img"]').attributes('aria-label')).toBe('Clay canvas weekender bag');
        expect(wrapper.text()).toContain('$106.00');
        const soldOut = wrapper.findAll('button').find((button) => button.text().includes('25 L'));
        expect(soldOut?.attributes('disabled')).toBeDefined();
        const add = wrapper.findAll('button').find((button) => button.text() === 'Add to bag');
        await add!.trigger('click');
        expect(wrapper.get('[role="status"]').text()).toBe('1 item in your bag');
    } finally {
        wrapper.unmount();
    }
});

it('fulfills only selected orders and persists a named view with the current filters', async () => {
    const wrapper = mount(OrdersInventory, { attachTo: document.body });
    try {
        await wrapper.get('tbody input[type="checkbox"]').setValue(true);
        const fulfill = wrapper.findAll('button').find((button) => button.text() === 'Mark fulfilled');
        expect(fulfill).toBeDefined();
        await fulfill!.trigger('click');
        const firstRow = wrapper.get('tbody tr');
        expect(firstRow.text()).toContain('RS-1048');
        expect(firstRow.text()).toContain('Fulfilled');
        expect(wrapper.text()).toContain('Fulfilled 1 order.');

        await wrapper.get('input[aria-label="Search orders or SKUs"]').setValue('BAG');
        const saveView = wrapper.findAll('button').find((button) => button.text() === 'Save view');
        expect(saveView).toBeDefined();
        await saveView!.trigger('click');
        await flushPromises();
        const dialog = document.querySelector<HTMLElement>('[role="dialog"]');
        const input = dialog?.querySelector<HTMLInputElement>('input');
        expect(input).toBeTruthy();
        input!.value = 'Bag orders';
        input!.dispatchEvent(new Event('input', { bubbles: true }));
        await nextTick();
        dialog!.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        await nextTick();

        expect(JSON.parse(localStorage.getItem(orderStorageKey) ?? '[]')).toEqual([expect.objectContaining({ label: 'Bag orders', query: 'BAG' })]);
        expect(wrapper.get('[role="status"]').text()).toContain('Saved view Bag orders.');
    } finally {
        wrapper.unmount();
    }
});

it('restores saved order dates and visible columns when a view is applied', async () => {
    localStorage.setItem(
        orderStorageKey,
        JSON.stringify([
            {
                id: 'saved:recent stock',
                label: 'Recent stock',
                query: '',
                filter: 'low-stock',
                datePreset: 'last7',
                dateRange: [],
                columns: ['stock', 'sku']
            }
        ])
    );
    const wrapper = mount(OrdersInventory);

    try {
        await nextTick();
        const views = wrapper.findAllComponents(Select).find((select) => select.props('ariaLabel') === 'Saved view');
        expect(views?.props('options')).toEqual(expect.arrayContaining([expect.objectContaining({ label: 'Recent stock' })]));
        views!.vm.$emit('update:modelValue', 'saved:recent stock');
        await nextTick();

        expect(views?.props('modelValue')).toBe('saved:recent stock');
        expect(wrapper.findAll('thead th').map((header) => header.text())).toEqual(['', 'Order', 'SKU', 'Stock']);
        expect(wrapper.findAll('tbody tr').map((row) => row.get('td:nth-child(2)').text())).toEqual(['RS-1047', 'RS-1045']);
    } finally {
        wrapper.unmount();
    }
});
