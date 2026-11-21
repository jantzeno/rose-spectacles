import { mount, type VueWrapper } from '@vue/test-utils';
import PickList from './PickList.vue';

describe('PickList.vue', () => {
    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(PickList, {
            props: {
                responsive: false,
                modelValue: [
                    [
                        {
                            id: '1000',
                            code: 'vbb124btr',
                            name: 'Game Controller',
                            description: 'Product Description',
                            image: 'game-controller.jpg',
                            price: 99,
                            category: 'Electronics',
                            quantity: 2,
                            inventoryStatus: 'LOWSTOCK',
                            rating: 4
                        },
                        {
                            id: '1001',
                            code: 'nvklal433',
                            name: 'Black Watch',
                            description: 'Product Description',
                            image: 'black-watch.jpg',
                            price: 72,
                            category: 'Accessories',
                            quantity: 61,
                            inventoryStatus: 'INSTOCK',
                            rating: 4
                        }
                    ],
                    []
                ]
            },
            slots: {
                sourceheader: 'Available',
                targetheader: 'Selected'
            }
        });
    });

    it('should exist', () => {
        expect(wrapper.find('.rs-picklist.rs-component').exists()).toBe(true);
        expect(wrapper.find('.rs-picklist-list-container.rs-picklist-source-list-container').exists()).toBe(true);
        expect(wrapper.find('.rs-picklist-list-container.rs-picklist-target-list-container').exists()).toBe(true);
    });

    it('should slots work', () => {
        expect(wrapper.find('.rs-picklist-source-list-container .rs-listbox-header').text()).toBe('Available');
        expect(wrapper.find('.rs-picklist-target-list-container .rs-listbox-header').text()).toBe('Selected');
    });

    it('should update sourceList and targetList', async () => {
        await wrapper.setProps({
            modelValue: [
                [
                    {
                        id: '1000',
                        code: 'vbb124btr',
                        name: 'Game Controller',
                        description: 'Product Description',
                        image: 'game-controller.jpg',
                        price: 99,
                        category: 'Electronics',
                        quantity: 2,
                        inventoryStatus: 'LOWSTOCK',
                        rating: 4
                    }
                ],
                [
                    {
                        id: '1001',
                        code: 'nvklal433',
                        name: 'Black Watch',
                        description: 'Product Description',
                        image: 'black-watch.jpg',
                        price: 72,
                        category: 'Accessories',
                        quantity: 61,
                        inventoryStatus: 'INSTOCK',
                        rating: 4
                    }
                ]
            ]
        });

        expect(wrapper.vm.sourceList.length).toBe(1);
        expect(wrapper.vm.targetList.length).toBe(1);
    });

    it('should select an item from source list', async () => {
        const sourceListItem = wrapper.find('.rs-picklist-source-list-container .rs-listbox-option');

        expect(sourceListItem.classes()).not.toContain('rs-listbox-option-selected');

        await sourceListItem.trigger('click');

        expect(sourceListItem.classes()).toContain('rs-listbox-option-selected');
        expect(wrapper.emitted('update:selection')?.[0]?.[0]).toEqual([[wrapper.vm.modelValue[0][0]], []]);
        expect(wrapper.emitted('selection-change')?.[0]?.[0]).toMatchObject({ originalEvent: expect.any(MouseEvent) });
    });

    it('should dblclick an item from source list', async () => {
        await wrapper.setProps({ selection: [[wrapper.vm.modelValue[0][0]], []] });

        await wrapper.get('.rs-picklist-source-list-container .rs-listbox-option').trigger('dblclick');

        expect(wrapper.emitted<[unknown[][]]>('update:modelValue')?.[0]?.[0]?.[1]).toEqual([wrapper.vm.modelValue[0][0]]);
        expect(wrapper.emitted()['move-to-target'][0]).toEqual([{ originalEvent: expect.any(MouseEvent), items: [wrapper.vm.modelValue[0][0]] }]);
        expect(wrapper.emitted('update:selection')?.[0]?.[0]).toEqual([[], []]);
    });

    it.each([
        ['moveToTarget', 0],
        ['moveToSource', 1]
    ] as const)('keeps unrelated items when %s receives a stale selection', async (move, listIndex) => {
        const modelValue = [['Available'], ['Chosen']];
        const selection: string[][] = [[], []];
        selection[listIndex] = ['Removed'];
        await wrapper.setProps({ modelValue, selection });

        wrapper.vm[move](new MouseEvent('click'));

        expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual(modelValue);
        expect(wrapper.emitted(move === 'moveToTarget' ? 'move-to-target' : 'move-to-source')?.[0]?.[0]).toMatchObject({ items: [] });
    });

    it('should move item up', async () => {
        await wrapper.setProps({ selection: [[wrapper.vm.modelValue[0][1]], []] });

        await wrapper.vm.moveUp({}, 0);

        expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual([
            [
                {
                    id: '1001',
                    code: 'nvklal433',
                    name: 'Black Watch',
                    description: 'Product Description',
                    image: 'black-watch.jpg',
                    price: 72,
                    category: 'Accessories',
                    quantity: 61,
                    inventoryStatus: 'INSTOCK',
                    rating: 4
                },
                {
                    id: '1000',
                    code: 'vbb124btr',
                    name: 'Game Controller',
                    description: 'Product Description',
                    image: 'game-controller.jpg',
                    price: 99,
                    category: 'Electronics',
                    quantity: 2,
                    inventoryStatus: 'LOWSTOCK',
                    rating: 4
                }
            ],
            []
        ]);
    });

    it('should should move all to target', async () => {
        await wrapper.vm.moveAllToTarget({});

        expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual([
            [],
            [
                {
                    id: '1000',
                    code: 'vbb124btr',
                    name: 'Game Controller',
                    description: 'Product Description',
                    image: 'game-controller.jpg',
                    price: 99,
                    category: 'Electronics',
                    quantity: 2,
                    inventoryStatus: 'LOWSTOCK',
                    rating: 4
                },
                {
                    id: '1001',
                    code: 'nvklal433',
                    name: 'Black Watch',
                    description: 'Product Description',
                    image: 'black-watch.jpg',
                    price: 72,
                    category: 'Accessories',
                    quantity: 61,
                    inventoryStatus: 'INSTOCK',
                    rating: 4
                }
            ]
        ]);
    });
});
