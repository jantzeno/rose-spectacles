import { mount, type VueWrapper } from '@vue/test-utils';
import type { TreeFilterEvent } from 'rose-spectacles/tree';
import { reactive } from 'vue';
import Tree from './Tree.vue';
import { useTreeDragDropService } from './TreeDragDropService';

it('starts a drag from a tree configured as a source only', () => {
    const node = { key: 'dragged', label: 'Dragged node' };
    const wrapper = mount(Tree, { props: { value: [node], draggableNodes: true } });
    const service = useTreeDragDropService();
    const content = wrapper.get('[data-pc-section="nodecontent"]').element;
    const start = new Event('dragstart', { cancelable: true });
    Object.defineProperty(start, 'dataTransfer', { value: { setData: vi.fn(), setDragImage: vi.fn() } });

    try {
        content.dispatchEvent(start);
        expect(service.dragState.dragNode).toMatchObject({ key: 'dragged' });

        content.dispatchEvent(new Event('dragend'));
        expect(service.dragState.dragNode).toBeNull();
    } finally {
        service.stopDrag({ node });
        wrapper.unmount();
    }
});

it.each(['loaded', 'lazy'])('preserves focus when expanding a %s tree node', async (mode) => {
    const children = [{ key: 'child', label: 'Child' }];
    const parentNode = { key: 'parent', label: 'Parent', leaf: false, children: mode === 'loaded' ? children : undefined };
    const sibling = { key: 'sibling', label: 'Sibling' };
    const wrapper = mount(Tree, { attachTo: document.body, props: { value: [parentNode, sibling] } });

    try {
        const parent = wrapper.get<HTMLElement>('[role="treeitem"][aria-label="Parent"]');
        parent.element.focus();

        await parent.trigger('keydown', { code: 'ArrowRight' });

        expect(wrapper.emitted('node-expand')).toHaveLength(1);
        expect(document.activeElement).toBe(parent.element);

        if (mode === 'lazy') {
            await wrapper.setProps({ value: [{ ...parentNode, children }, sibling] });
            expect(document.activeElement).toBe(parent.element);
        }

        await parent.trigger('keydown', { code: 'ArrowRight' });
        expect(document.activeElement).toBe(wrapper.get('[role="treeitem"][aria-label="Child"]').element);
    } finally {
        wrapper.unmount();
    }
});

describe('Tree.vue', () => {
    let wrapper: VueWrapper<InstanceType<typeof Tree>>;

    beforeEach(async () => {
        wrapper = mount(Tree, {
            props: {
                value: [
                    {
                        key: '0',
                        label: 'Documents',
                        data: 'Documents Folder',
                        icon: 'pi pi-fw pi-inbox',
                        children: []
                    }
                ]
            },
            slots: {
                default: `<input data-tree-input />`
            }
        });
    });

    it('should exists', () => {
        expect(wrapper.find('.rs-tree.rs-component').exists()).toBe(true);
    });

    it('triggers event', async () => {
        wrapper.trigger('keydown.space');
        expect(wrapper.emitted('keydown')).toBeTruthy();
    });

    it('stops event propagation from content', async () => {
        // If the event propagation is not stopped from content, then inputs would not work as expected
        let textInput = wrapper.find('input[data-tree-input]');

        await textInput.trigger('keydown.space');

        expect(wrapper.emitted('keydown')).toBeFalsy();
    });

    it('emits update:filterValue on filter input', async () => {
        wrapper = mount(Tree, {
            props: {
                filter: true
            }
        });

        const searchField = wrapper.get<HTMLInputElement>('input.rs-inputtext');
        const key = 't';

        searchField.element.value = key;

        await searchField.trigger('keyup', {
            key
        });

        expect(wrapper.emitted('filter')).toBeTruthy();
        expect(wrapper.emitted<[TreeFilterEvent]>('filter')?.[0][0].value).toEqual(key);
    });

    it('emits filteredNodes in filter event payload', async () => {
        const nodes = [
            {
                key: '0',
                label: 'Documents',
                children: [
                    { key: '0-0', label: 'Work' },
                    { key: '0-1', label: 'Home' }
                ]
            },
            {
                key: '1',
                label: 'Downloads',
                children: []
            }
        ];

        wrapper = mount(Tree, {
            props: {
                value: nodes,
                filter: true,
                filterBy: 'label',
                filterMode: 'lenient'
            }
        });

        const searchField = wrapper.get<HTMLInputElement>('input.rs-inputtext');

        searchField.element.value = 'Work';

        await searchField.trigger('keyup', { key: 'k' });

        expect(wrapper.emitted('filter')).toBeTruthy();

        const filterEvent = wrapper.emitted<[TreeFilterEvent]>('filter')?.[0][0];

        expect(filterEvent?.filteredNodes).toBeDefined();
        expect(Array.isArray(filterEvent?.filteredNodes)).toBe(true);
    });

    it('emits the node from value on expand while filtering so lazy loading can update it', async () => {
        const nodes = reactive([
            { key: '0', label: 'Node 0', leaf: false },
            { key: '1', label: 'Node 1', leaf: false }
        ]);

        wrapper = mount(Tree, {
            props: {
                value: nodes,
                filter: true,
                filterBy: 'label',
                'onNode-expand': (node) => {
                    node.children = [{ key: '0-0', label: 'Node 0 child' }];
                }
            }
        });

        await wrapper.find('input.rs-inputtext').setValue('0');
        await wrapper.find('.rs-tree-node-toggle-button').trigger('click');

        expect(wrapper.emitted('node-expand')?.[0][0]).toBe(nodes[0]);
        expect(wrapper.text()).toContain('Node 0 child');
    });

    it('should render icon', ({ expect }) => {
        expect(wrapper.find('span.pi-inbox').exists()).toBeTruthy();
        expect(wrapper.find('span.pi-inbox').classes('rs-tree-node-icon')).toBeTruthy();
    });

    it('should render icon slot', ({ expect }) => {
        let wrapper = mount(Tree, {
            slots: {
                nodeicon: `<i data-node-icon/>`
            },
            props: {
                value: [
                    {
                        key: '0',
                        label: 'Documents',
                        data: 'Documents Folder',
                        children: []
                    }
                ]
            }
        });

        const nodeIcon = wrapper.find('i[data-node-icon]');

        expect(nodeIcon.exists()).toBeTruthy();
    });
});
