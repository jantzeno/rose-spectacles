<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import OrganizationChartStyle from './style/OrganizationChartStyle';

export default defineComponent({
    name: 'BaseOrganizationChart',
    extends: BaseComponent,
    props: {
        value: {
            type: null,
            default: null
        },
        selectionKeys: {
            type: null,
            default: null
        },
        selectionMode: {
            type: String,
            default: null
        },
        collapsible: {
            type: Boolean,
            default: false
        },
        collapsedKeys: {
            type: null,
            default: null
        }
    },
    style: OrganizationChartStyle,
    provide() {
        return {
            $pcOrganizationChart: this,
            $parentInstance: this
        };
    }
});
</script>
