<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import AccordionTabStyle from './style/AccordionTabStyle';

export default defineComponent({
    name: 'BaseAccordionTab',
    extends: BaseComponent,
    props: {
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
    style: AccordionTabStyle,
    provide() {
        return {
            $pcAccordionTab: this,
            $parentInstance: this
        };
    }
});
</script>
