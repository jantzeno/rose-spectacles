<script lang="ts">
import { defineComponent } from 'vue';
import Drawer from '../drawer/Drawer.vue';

export default defineComponent({
    name: 'Sidebar',
    extends: Drawer,
    mounted() {
        console.warn('Deprecated since v4. Use Drawer component instead.');
    }
});
</script>
