<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import BreadcrumbStyle from './style/BreadcrumbStyle';

export default defineComponent({
    name: 'BaseBreadcrumb',
    extends: BaseComponent,
    props: {
        model: {
            type: Array,
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
