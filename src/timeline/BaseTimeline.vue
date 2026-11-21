<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import TimelineStyle from './style/TimelineStyle';

export default defineComponent({
    name: 'BaseTimeline',
    extends: BaseComponent,
    props: {
        value: null,
        align: {
            mode: String,
            default: 'left'
        },
        layout: {
            mode: String,
            default: 'vertical'
        },
        dataKey: null
    },
    style: TimelineStyle,
    provide() {
        return {
            $pcTimeline: this,
            $parentInstance: this
        };
    }
});
</script>
