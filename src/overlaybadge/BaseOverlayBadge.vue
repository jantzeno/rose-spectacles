<script lang="ts">
import { defineComponent } from 'vue';
import Badge from '../badge/Badge.vue';
import OverlayBadgeStyle from './style/OverlayBadgeStyle';

export default defineComponent({
    name: 'OverlayBadge',
    extends: Badge,
    style: OverlayBadgeStyle,
    provide() {
        return {
            $pcOverlayBadge: this,
            $parentInstance: this
        };
    }
});
</script>
