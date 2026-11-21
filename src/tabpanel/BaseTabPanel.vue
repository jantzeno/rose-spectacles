<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import TabPanelStyle from './style/TabPanelStyle';

export default defineComponent({
    name: 'BaseTabPanel',
    extends: BaseComponent,
    props: {
        // in Tabs
        value: {
            type: [String, Number],
            default: undefined
        },
        as: {
            type: [String, Object],
            default: 'DIV'
        },
        asChild: {
            type: Boolean,
            default: false
        },
        // in TabView
        header: null,
        headerStyle: null,
        headerClass: null,
        headerProps: null,
        headerActionProps: null,
        contentStyle: null,
        contentClass: null,
        contentProps: null,
        disabled: Boolean
    },
    style: TabPanelStyle,
    provide() {
        return {
            $pcTabPanel: this,
            $parentInstance: this
        };
    }
});
</script>
