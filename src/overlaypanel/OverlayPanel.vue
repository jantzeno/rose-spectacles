<script lang="ts">
import { defineComponent } from 'vue';
import Popover from '../popover/Popover.vue';

export default defineComponent({
    name: 'OverlayPanel',
    extends: Popover,
    mounted() {
        console.warn('Deprecated since v4. Use Popover component instead.');
    }
});
</script>
