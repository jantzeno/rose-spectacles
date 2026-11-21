<script lang="ts">
import type { MenuItem } from 'rose-spectacles/menuitem';
import { defineComponent, type PropType } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import BreadcrumbStyle from './style/BreadcrumbStyle';

export default defineComponent({
    name: 'BaseBreadcrumb',
    extends: BaseComponent,
    props: {
        model: {
            type: Array as PropType<MenuItem[]>,
            default: null
        },
        home: {
            type: null,
            default: null
        }
    },
    style: BreadcrumbStyle,
    provide() {
        return {
            $pcBreadcrumb: this,
            $parentInstance: this
        };
    }
});
</script>
