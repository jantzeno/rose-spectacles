<script>
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import AccordionTabStyle from './style/AccordionTabStyle';

export default {
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
};
</script>
