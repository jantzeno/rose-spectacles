<script>
import Badge from '../badge/Badge.vue';
import OverlayBadgeStyle from './style/OverlayBadgeStyle';

export default {
    name: 'OverlayBadge',
    extends: Badge,
    style: OverlayBadgeStyle,
    provide() {
        return {
            $pcOverlayBadge: this,
            $parentInstance: this
        };
    }
};
</script>
