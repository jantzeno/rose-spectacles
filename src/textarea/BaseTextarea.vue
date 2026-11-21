<script lang="ts">
import { defineComponent } from 'vue';
import BaseInput from '../core/baseinput/BaseInput.vue';
import TextareaStyle from './style/TextareaStyle';

export default defineComponent({
    name: 'BaseTextarea',
    extends: BaseInput,
    props: {
        autoResize: Boolean
    },
    style: TextareaStyle,
    provide() {
        return {
            $pcTextarea: this,
            $parentInstance: this
        };
    }
});
</script>
