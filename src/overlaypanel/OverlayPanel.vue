<script>
import Popover from '../popover/Popover.vue';

export default {
    name: 'OverlayPanel',
    extends: Popover,
    mounted() {
        console.warn('Deprecated since v4. Use Popover component instead.');
    }
};
</script>
