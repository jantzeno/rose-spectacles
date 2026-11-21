<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import BadgeStyle from './style/BadgeStyle';

export default defineComponent({
    name: 'BaseBadge',
    extends: BaseComponent,
    props: {
        value: {
            type: [String, Number],
            default: null
        },
        severity: {
            type: String,
            default: null
        },
        size: {
            type: String,
            default: null
        }
    },
    style: BadgeStyle,
    provide() {
        return {
            $pcBadge: this,
            $parentInstance: this
        };
    }
});
</script>
