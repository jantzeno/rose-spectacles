import assert from 'node:assert/strict';
import { FilterMatchMode, FilterOperator } from '../core/api/Api';
import { mount } from '@vue/test-utils';
import PrimeVue from '../config/Config';
import { h, nextTick } from 'vue';
import Column from '../column/Column.vue';
import ColumnGroup from '../columngroup/ColumnGroup.vue';
import Row from '../row/Row.vue';
import TreeSelect from '../treeselect/TreeSelect.vue';
import DataTable from './DataTable.vue';
import ColumnFilter from './ColumnFilter.vue';

function elementWithin(root: ParentNode, selector: string) {
    const element = root.querySelector(selector);
    assert(element, `Missing ${selector}`);
    return element;
}

const products = [
    { id: '1000', name: 'Game Controller' },
    { id: '1001', name: 'Black Watch' }
];

const mountTable = () =>
    mount(
        {
            components: { DataTable, Column },
            data() {
                return {
                    products,
                    filters: {
                        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
                    }
                };
            },
            template: `
                <DataTable :value="products" v-model:filters="filters" filterDisplay="menu">
                    <Column field="name" header="Name">
                        <template #filter="{ filterModel }">
                            <input type="text" v-model="filterModel.value" />
                        </template>
                    </Column>
                </DataTable>
            `
        },
        { global: { plugins: [PrimeVue], stubs: { teleport: false, transition: false } }, attachTo: document.body }
    );

describe('ColumnFilter', () => {
    it('renders inline filters and empty spacers as data cells under the column headers', async () => {
        const width = vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(120);
        const wrapper = mount(
            {
                components: { DataTable, Column },
                data: () => ({ products, filters: { name: { value: null, matchMode: FilterMatchMode.STARTS_WITH } } }),
                template: `
                    <DataTable :value="products" v-model:filters="filters" filterDisplay="row" scrollable resizableColumns>
                        <Column field="id" header="Code" frozen />
                        <Column field="name" header="Name" frozen :showFilterMenu="false">
                            <template #filter="{ filterModel, filterCallback }">
                                <input aria-label="Filter name" v-model="filterModel.value" @input="filterCallback()" />
                            </template>
                        </Column>
                        <Column header="Notes" />
                    </DataTable>
                `
            },
            { global: { plugins: [PrimeVue] } }
        );

        try {
            await nextTick();
            const [headings, filters] = wrapper.findAll('thead tr');
            const cells = filters.findAll<HTMLTableCellElement>('td');

            expect(headings.findAll('th').map((cell) => cell.text())).toEqual(['Code', 'Name', 'Notes']);
            expect(filters.findAll('th')).toHaveLength(0);
            expect(cells).toHaveLength(3);
            expect(cells[0].text()).toBe('');
            expect(cells[1].element.style.insetInlineStart).toBe('120px');
            expect(cells[2].text()).toBe('');

            await cells[1].get<HTMLInputElement>('input[aria-label="Filter name"]').setValue('Black');
            expect(wrapper.findAll('tbody tr').map((row) => row.text())).toEqual(['1001Black Watch']);
        } finally {
            wrapper.unmount();
            width.mockRestore();
        }
    });

    it('keeps a live filter open when the table shrinks and dismisses it on manual scroll', async () => {
        const wrapper = mount(
            {
                components: { DataTable, Column },
                data: () => ({ products, filters: { name: { value: null, matchMode: FilterMatchMode.STARTS_WITH } } }),
                template: `
                    <DataTable :value="products" v-model:filters="filters" filterDisplay="menu" scrollable>
                        <Column field="id" header="Code" />
                        <Column field="name" header="Name" :showApplyButton="false">
                            <template #filter="{ filterModel, filterCallback }">
                                <input aria-label="Filter name" v-model="filterModel.value" @input="filterCallback()" />
                            </template>
                        </Column>
                    </DataTable>
                `
            },
            { global: { plugins: [PrimeVue], stubs: { teleport: false } }, attachTo: document.body }
        );

        try {
            const scroller = wrapper.get<HTMLElement>('.rs-datatable-table-container');
            const toggle = wrapper.get<HTMLButtonElement>('thead button[aria-haspopup]');
            const anchor = vi.spyOn(toggle.element, 'getBoundingClientRect');
            scroller.element.style.overflow = 'auto';
            Object.defineProperty(scroller.element, 'clientWidth', { value: 300 });
            Object.defineProperty(scroller.element, 'scrollWidth', { value: 900, configurable: true });
            scroller.element.scrollLeft = 600;

            await toggle.trigger('click');
            const overlay = elementWithin(document, '.rs-datatable-filter-overlay') as HTMLElement;
            wrapper.getComponent(ColumnFilter).vm.onOverlayEnter(overlay);
            const input = elementWithin(overlay, '[aria-label="Filter name"]') as HTMLInputElement;
            input.focus();
            input.value = 'Bl';
            input.dispatchEvent(new Event('input', { bubbles: true }));
            await nextTick();
            expect(wrapper.findAll('tbody tr').map((row) => row.text())).toEqual(['1001Black Watch']);

            Object.defineProperty(scroller.element, 'scrollWidth', { value: 400 });
            scroller.element.scrollLeft = 100;
            input.value = 'Black';
            input.dispatchEvent(new Event('input', { bubbles: true }));
            await nextTick();
            const measurementsBeforeScroll = anchor.mock.calls.length;
            await scroller.trigger('scroll');
            expect(toggle.attributes('aria-expanded')).toBe('true');
            expect(document.activeElement).toBe(input);
            expect(anchor.mock.calls.length).toBeGreaterThan(measurementsBeforeScroll);

            input.value = 'Black Watch';
            input.dispatchEvent(new Event('input', { bubbles: true }));
            await nextTick();
            expect(wrapper.findAll('tbody tr').map((row) => row.text())).toEqual(['1001Black Watch']);
            scroller.element.scrollLeft = 50;
            await scroller.trigger('scroll');
            expect(toggle.attributes('aria-expanded')).toBe('false');
            expect(document.activeElement).toBe(toggle.element);
        } finally {
            wrapper.unmount();
        }
    });

    it('restores saved filters and initializes filters for newly added columns', async () => {
        const stateKey = 'datatable-new-column-filter';
        const storedFilter = { value: 'A', matchMode: FilterMatchMode.STARTS_WITH };
        localStorage.setItem(stateKey, JSON.stringify({ filters: { id: storedFilter } }));

        const wrapper = mount(
            {
                components: { DataTable, Column },
                data: () => ({
                    stateKey,
                    rows: [
                        { id: 'A1', name: 'Game Controller' },
                        { id: 'A2', name: 'Black Watch' },
                        { id: 'B1', name: 'Black Shirt' }
                    ],
                    filters: {
                        id: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
                        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
                    }
                }),
                template: `
                    <DataTable :value="rows" v-model:filters="filters" filterDisplay="menu" stateStorage="local" :stateKey="stateKey">
                        <Column field="id" header="Code" />
                        <Column field="name" header="Name" :showFilterMatchModes="false">
                            <template #filter="{ filterModel }">
                                <input aria-label="Filter name" v-model="filterModel.value" />
                            </template>
                        </Column>
                    </DataTable>
                `
            },
            { global: { plugins: [PrimeVue], stubs: { teleport: false } }, attachTo: document.body }
        );

        try {
            await nextTick();
            expect(wrapper.findAll('tbody tr').map((row) => row.text())).toEqual(['A1Game Controller', 'A2Black Watch']);

            await wrapper.get('thead th:nth-child(2) button[aria-haspopup]').trigger('click');
            const overlay = elementWithin(document, '.rs-datatable-filter-overlay');
            const input = elementWithin(overlay, '[aria-label="Filter name"]') as HTMLInputElement;
            expect(input.value).toBe('');
            input.value = 'Black';
            input.dispatchEvent(new Event('input', { bubbles: true }));
            (elementWithin(overlay, 'button[aria-label="Apply"]') as HTMLButtonElement).click();
            await nextTick();

            expect(wrapper.findAll('tbody tr').map((row) => row.text())).toEqual(['A2Black Watch']);
            expect(JSON.parse(localStorage.getItem(stateKey) ?? '{}').filters).toEqual({
                id: storedFilter,
                name: { value: 'Black', matchMode: FilterMatchMode.STARTS_WITH }
            });
        } finally {
            wrapper.unmount();
            localStorage.removeItem(stateKey);
        }
    });

    it('clears an active inline filter and returns focus to its input', async () => {
        const wrapper = mount(
            {
                components: { DataTable, Column },
                data: () => ({ products, filters: { name: { value: null, matchMode: FilterMatchMode.STARTS_WITH } } }),
                template: `
                    <DataTable :value="products" v-model:filters="filters" filterDisplay="row"
                        :filterButtonProps="{ inline: { clear: { 'data-testid': 'clear-name' } } }">
                        <Column field="name" header="Name" showClearButton :showFilterMenu="false">
                            <template #filter="{ filterModel, filterCallback }">
                                <input aria-label="Filter name" v-model="filterModel.value" @input="filterCallback()" />
                            </template>
                        </Column>
                    </DataTable>
                `
            },
            { global: { plugins: [PrimeVue] }, attachTo: document.body }
        );

        try {
            const input = wrapper.get<HTMLInputElement>('[aria-label="Filter name"]');
            expect(wrapper.find('[data-testid="clear-name"]').exists()).toBe(false);
            await input.setValue('Black');
            expect(wrapper.findAll('tbody tr').map((row) => row.text())).toEqual(['Black Watch']);

            const clear = wrapper.get<HTMLButtonElement>('button[data-testid="clear-name"]');
            expect(clear.attributes('aria-label')).toBe('Clear');
            clear.element.focus();
            clear.element.click();
            await nextTick();
            const clearedInput = wrapper.get<HTMLInputElement>('[aria-label="Filter name"]');
            expect(clearedInput.element.value).toBe('');
            expect(wrapper.findAll('tbody tr').map((row) => row.text())).toEqual(['Game Controller', 'Black Watch']);
            expect(wrapper.find('[data-testid="clear-name"]').exists()).toBe(false);
            expect(document.activeElement).toBe(clearedInput.element);
        } finally {
            wrapper.unmount();
        }
    });

    it('changes the match mode of a menu filter with a single value', async () => {
        const wrapper = mount(
            {
                components: { DataTable, Column },
                data: () => ({ products, filters: { name: { value: 'Watch', matchMode: FilterMatchMode.STARTS_WITH } } }),
                template: `
                    <DataTable :value="products" v-model:filters="filters" filterDisplay="menu">
                        <Column field="name" header="Name" :showFilterOperator="false" :showAddButton="false" :showApplyButton="false">
                            <template #filter="{ filterModel }">
                                <input aria-label="Filter name" v-model="filterModel.value" />
                            </template>
                        </Column>
                    </DataTable>
                `
            },
            { global: { plugins: [PrimeVue], stubs: { teleport: false } }, attachTo: document.body }
        );

        try {
            expect(wrapper.findAll('tbody tr').map((row) => row.text())).not.toContain('Black Watch');
            await wrapper.get('thead button[aria-haspopup]').trigger('click');
            const overlay = elementWithin(document, '.rs-datatable-filter-overlay');
            elementWithin(overlay, '.rs-select').dispatchEvent(new MouseEvent('click', { bubbles: true }));
            await nextTick();

            const options = elementWithin(document, '.rs-select-overlay').querySelectorAll<HTMLElement>('[role="option"]');
            const contains = [...options].find((option) => option.textContent?.trim() === 'Contains');
            assert(contains, 'Missing Contains match mode');
            contains.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            await nextTick();

            expect(wrapper.findAll('tbody tr').map((row) => row.text())).toEqual(['Black Watch']);
            expect(wrapper.getComponent(DataTable).emitted('update:filters')).toEqual([[{ name: { value: 'Watch', matchMode: FilterMatchMode.CONTAINS } }]]);
        } finally {
            wrapper.unmount();
        }
    });

    it.each(['field', 'filterField'])('filters by a function-valued column %s', async (source) => {
        const resolveValue = ({ name }: (typeof products)[number]) => name.split(' ').at(-1) ?? '';
        const key = String(resolveValue);
        const wrapper = mount(
            {
                components: { DataTable, Column },
                data: () => ({
                    products,
                    field: source === 'field' ? resolveValue : 'name',
                    filterField: source === 'filterField' ? resolveValue : undefined,
                    filters: { [key]: { value: null, matchMode: FilterMatchMode.STARTS_WITH } }
                }),
                template: `
                    <DataTable :value="products" v-model:filters="filters" filterDisplay="row">
                        <Column :field="field" :filterField="filterField" header="Name" :showFilterMenu="false">
                            <template #filter="{ filterModel, filterCallback }">
                                <input aria-label="Filter by last word" v-model="filterModel.value" @input="filterCallback()" />
                            </template>
                        </Column>
                    </DataTable>
                `
            },
            { global: { plugins: [PrimeVue] } }
        );

        try {
            expect(wrapper.findAll('tbody tr')).toHaveLength(2);
            await wrapper.get<HTMLInputElement>('[aria-label="Filter by last word"]').setValue('Wat');
            expect(wrapper.findAll('tbody tr').map((row) => row.text())).toEqual([source === 'field' ? 'Watch' : 'Black Watch']);
        } finally {
            wrapper.unmount();
        }
    });

    it('uses the column key for a computed filter in a grouped header menu', async () => {
        const wrapper = mount(
            {
                components: { DataTable, Column, ColumnGroup, Row },
                data: () => ({
                    products,
                    resolveValue: ({ name }: (typeof products)[number]) => name.split(' ').at(-1) ?? '',
                    filters: { suffix: { value: 'Wat', matchMode: FilterMatchMode.STARTS_WITH } }
                }),
                template: `
                    <DataTable :value="products" v-model:filters="filters" filterDisplay="menu">
                        <ColumnGroup type="header">
                            <Row>
                                <Column header="Name" :filterField="resolveValue" columnKey="suffix" :showFilterMatchModes="false">
                                    <template #filter="{ field, filterModel }">
                                        <input :aria-label="'Filter ' + field" v-model="filterModel.value" />
                                    </template>
                                </Column>
                            </Row>
                        </ColumnGroup>
                        <Column field="name" />
                    </DataTable>
                `
            },
            { global: { plugins: [PrimeVue], stubs: { teleport: true } } }
        );

        try {
            expect(wrapper.findAll('tbody tr').map((row) => row.text())).toEqual(['Black Watch']);
            await wrapper.get('thead button[aria-haspopup]').trigger('click');
            const input = wrapper.get<HTMLInputElement>('[aria-label="Filter suffix"]');
            await input.setValue('Con');
            await wrapper.get('button[aria-label="Apply"]').trigger('click');
            expect(wrapper.findAll('tbody tr').map((row) => row.text())).toEqual(['Game Controller']);
        } finally {
            wrapper.unmount();
        }
    });

    it('keeps the filter menu open while expanding, collapsing, and selecting nested TreeSelect nodes', async () => {
        const wrapper = mount(
            {
                components: { DataTable, Column, TreeSelect },
                data: () => ({
                    products,
                    filters: { name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] } },
                    nodes: [{ key: 'documents', label: 'Documents', children: [{ key: 'work', label: 'Work', children: [{ key: 'notes', label: 'Notes' }] }] }]
                }),
                template: `
                    <DataTable :value="products" v-model:filters="filters" filterDisplay="menu">
                        <Column field="name">
                            <template #filter="{ filterModel }">
                                <TreeSelect v-model="filterModel.value" :options="nodes" />
                            </template>
                        </Column>
                    </DataTable>
                `
            },
            { global: { plugins: [PrimeVue], stubs: { teleport: false, transition: false } }, attachTo: document.body }
        );

        try {
            await wrapper.get('[data-pc-section="filter"] button').trigger('click');
            const filter = elementWithin(document, '.rs-datatable-filter-overlay');
            const click = async (element: Element) => {
                element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                await nextTick();
            };
            await click(elementWithin(filter, '.rs-treeselect'));
            const panel = elementWithin(document, '.rs-treeselect-overlay');
            const documents = elementWithin(panel, '[aria-label="Documents"] [data-pc-section="nodetogglebutton"]');

            await click(documents);
            expect(filter.isConnected && panel.isConnected).toBe(true);
            await click(documents);
            expect(filter.isConnected && panel.isConnected).toBe(true);
            expect(panel.querySelector('[aria-label="Work"]')).toBeNull();
            await click(documents);
            await click(elementWithin(panel, '[aria-label="Work"] [data-pc-section="nodetogglebutton"]'));
            expect(elementWithin(panel, '[aria-label="Notes"]').isConnected).toBe(true);

            await click(elementWithin(panel, '[aria-label="Work"] [data-pc-section="nodelabel"]'));
            expect(filter.isConnected).toBe(true);
            expect(elementWithin(filter, '.rs-treeselect-label').textContent).toContain('Work');
        } finally {
            wrapper.unmount();
        }
    });

    it('clears a row filter when Enter activates the last menu item', async () => {
        const wrapper = mount(ColumnFilter, {
            props: {
                field: 'name',
                display: 'row',
                column: h(Column),
                filters: { name: { value: 'Copper', matchMode: FilterMatchMode.CONTAINS } },
                filterButtonProps: { filter: {} }
            },
            global: { plugins: [PrimeVue], stubs: { teleport: true } }
        });

        try {
            await wrapper.get('button').trigger('click');
            const clearItem = wrapper.findAll('li').at(-1);
            assert(clearItem);

            await clearItem.trigger('keydown', { code: 'Enter', key: 'Enter' });

            expect(wrapper.emitted('filter-clear')).toEqual([[]]);
            expect(wrapper.emitted('filter-change')?.[0]?.[0]).toEqual({ name: { value: null, matchMode: FilterMatchMode.CONTAINS } });
        } finally {
            wrapper.unmount();
        }
    });

    it('should keep the filter overlay open when an option of a nested Select is clicked', async () => {
        const wrapper = mountTable();

        await nextTick();

        await wrapper.find('[data-pc-section="filter"] button').trigger('click');
        await nextTick();

        const columnFilter = wrapper.findComponent({ name: 'ColumnFilter' });
        const filterOverlay = elementWithin(document, '.rs-datatable-filter-overlay');

        expect(filterOverlay).not.toBeNull();

        // open the operator Select rendered inside the filter overlay
        const select = elementWithin(filterOverlay, '[data-pc-name="pcfilteroperatordropdown"]');

        select.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        select.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await nextTick();
        await nextTick();

        // the Select overlay is portalled to the body, so it is not a DOM descendant of the filter overlay
        const selectOverlay = elementWithin(document, '.rs-select-overlay');

        expect(selectOverlay).not.toBeNull();
        expect(filterOverlay.contains(selectOverlay)).toBe(false);

        elementWithin(selectOverlay, '[data-pc-section="option"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await nextTick();
        await nextTick();

        expect(columnFilter.vm.overlayVisible).toBe(true);

        wrapper.unmount();
    });

    // Under SSR (Nuxt) Vue's useId() returns nested ids such as "v-0-10", so useAttrSelector produces
    // selectors like "pc0_10" rather than the flat "pc14" seen in a client-only test environment.
    it('should recognise nested overlays whose attribute selector has an SSR-style id', async () => {
        const wrapper = mountTable();

        await nextTick();

        await wrapper.find('[data-pc-section="filter"] button').trigger('click');
        await nextTick();

        const columnFilter = wrapper.findComponent({ name: 'ColumnFilter' });
        const filterOverlay = elementWithin(document, '.rs-datatable-filter-overlay');
        const select = elementWithin(filterOverlay, '[data-pc-name="pcfilteroperatordropdown"]');

        select.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        select.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await nextTick();
        await nextTick();

        const selectOverlay = elementWithin(document, '.rs-select-overlay');
        const attrSelector = [...selectOverlay.attributes].map((attr) => attr.name).find((name) => /^pc\w+$/.test(name));

        assert(attrSelector, 'The Select overlay has a pass-through attribute selector');

        // rewrite the flat selector into the nested form SSR produces, on both the overlay and its owner
        const ssrAttrSelector = attrSelector.replace(/^pc/, 'pc0_');

        selectOverlay.removeAttribute(attrSelector);
        selectOverlay.setAttribute(ssrAttrSelector, '');
        filterOverlay.querySelectorAll(`[${attrSelector}]`).forEach((el) => {
            el.removeAttribute(attrSelector);
            el.setAttribute(ssrAttrSelector, '');
        });

        const option = elementWithin(selectOverlay, '[data-pc-section="option"]');

        expect(columnFilter.vm.isNestedOverlayClicked(option)).toBe(true);

        option.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await nextTick();
        await nextTick();

        expect(columnFilter.vm.overlayVisible).toBe(true);

        wrapper.unmount();
    });

    it('should keep the filter overlay open when an option of a nested Select is committed on mousedown', async () => {
        const wrapper = mountTable();

        await nextTick();

        await wrapper.find('[data-pc-section="filter"] button').trigger('click');
        await nextTick();

        const columnFilter = wrapper.findComponent({ name: 'ColumnFilter' });
        const filterOverlay = elementWithin(document, '.rs-datatable-filter-overlay');
        const select = elementWithin(filterOverlay, '[data-pc-name="pcfilteroperatordropdown"]');

        select.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        select.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await nextTick();
        await nextTick();

        const option = elementWithin(document, '.rs-select-overlay [data-pc-section="option"]');

        expect(option).not.toBeNull();

        // Select commits the option on mousedown and hides its overlay from a timeout, so the
        // option is detached before the browser dispatches click. The browser then retargets that
        // click to an ancestor still in the tree, which is outside of the filter overlay.
        option.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        await nextTick();
        await new Promise((resolve) => setTimeout(resolve, 20));

        document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await nextTick();
        await nextTick();

        expect(columnFilter.vm.overlayVisible).toBe(true);

        wrapper.unmount();
    });

    it('should close the filter overlay when a genuine outside click occurs', async () => {
        const wrapper = mountTable();

        await nextTick();

        await wrapper.find('[data-pc-section="filter"] button').trigger('click');
        await nextTick();

        const columnFilter = wrapper.findComponent({ name: 'ColumnFilter' });

        expect(columnFilter.vm.overlayVisible).toBe(true);

        document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await nextTick();

        expect(columnFilter.vm.overlayVisible).toBe(false);

        wrapper.unmount();
    });
});
