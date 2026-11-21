<script lang="ts">
import { defineComponent } from 'vue';
import BaseEditableHolder from '../core/baseeditableholder/BaseEditableHolder.vue';
import EditorStyle from './style/EditorStyle';

export default defineComponent({
    name: 'BaseEditor',
    extends: BaseEditableHolder,
    props: {
        placeholder: String,
        readonly: Boolean,
        formats: Array,
        editorStyle: null,
        modules: null
    },
    style: EditorStyle,
    provide() {
        return {
            $pcEditor: this,
            $parentInstance: this
        };
    }
});
</script>
