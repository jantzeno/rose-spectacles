<script lang="ts">
import { defineComponent } from 'vue';
import ToggleSwitch from '../toggleswitch/ToggleSwitch.vue';

export default defineComponent({
    name: 'InputSwitch',
    extends: ToggleSwitch,
    mounted() {
        console.warn('Deprecated since v4. Use ToggleSwitch component instead.');
    }
});
</script>
