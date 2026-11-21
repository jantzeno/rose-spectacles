import { mount, type VueWrapper } from '@vue/test-utils';
import TabPanel from '../tabpanel/TabPanel.vue';
import TabView from './TabView.vue';

describe('TabPanel.vue', () => {
    let wrapper: VueWrapper<any>;

    window.HTMLElement.prototype.scrollIntoView = function () {};

    beforeEach(() => {
        wrapper = mount(TabView, {
            global: {
                components: {
                    TabPanel
                }
            },
            slots: {
                default: `
                    <TabPanel header="Header I">
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,</p>
                    </TabPanel>
                    <TabPanel header="Header II">
                        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem</p>
                    </TabPanel>
                    <TabPanel header="Header III">
                        <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui</p>
                    </TabPanel>
                `
            }
        });
    });

    it('should exist', () => {
        expect(wrapper.find('.rs-tabview.rs-component').exists()).toBe(true);
        expect(wrapper.find('.rs-tabview-ink-bar').exists()).toBe(true);
        expect(wrapper.findAll('a.rs-tabview-tab-header').length).toBe(3);
        expect(wrapper.findAll('.rs-tabview-panel').length).toBe(3);
        expect(wrapper.findAll('li[role="presentation"]')[0].classes()).toContain('rs-tabview-tablist-item-active');
        expect(wrapper.findAll('.rs-tabview-panel')[1].attributes().style).toBe('display: none;');
    });

    it('should change the active item', async () => {
        await wrapper.vm.onTabClick({}, 1);

        // expect(wrapper.findAll('li[role="presentation"]')[1].classes()).toContain('rs-tabview-header');
        expect(wrapper.findAll('.rs-tabview-panel')[0].attributes().style).toBe('display: none;');
    });
});

// todo deprecate?
// describe('dynamic tabs', () => {
//     it('should exist', () => {
//         const wrapper = mount(TabView, {
//             global: {
//                 components: {
//                     TabPanel
//                 }
//             },
//             slots: {
//                 default: `
//                     <TabPanel v-for="tab in Array.from({ length: 5 }, (_, i) => ({ title: \`Tab \${i + 1}\`, content: \`Tab \${i + 1} Content\` }))" :key="tab.title" :header="tab.title">
//                         <p>{{tab.content}}</p>
//                     </TabPanel>
//                 `
//             }
//         });
//
//         expect(wrapper.find('.rs-tabview.rs-component').exists()).toBe(true);
//         expect(wrapper.find('.rs-tabview-ink-bar').exists()).toBe(true);
//         expect(wrapper.findAll('a.rs-tabview-nav-link').length).toBe(5);
//         expect(wrapper.findAll('.rs-tabview-panel').length).toBe(5);
//         expect(wrapper.findAll('li[role="presentation"]')[0].classes()).toContain('rs-highlight');
//         expect(wrapper.findAll('.rs-tabview-panel')[1].attributes().style).toBe('display: none;');
//     });
// });
