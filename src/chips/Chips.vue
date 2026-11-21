<script lang="ts">
import { defineComponent } from 'vue';
import InputChips from '../inputchips/InputChips.vue';

export default defineComponent({
    name: 'Chips',
    extends: InputChips,
    mounted() {
        console.warn('Deprecated since v4. Use InputChips component instead.');
    }
});
</script>
