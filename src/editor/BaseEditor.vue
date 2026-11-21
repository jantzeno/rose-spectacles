<script lang="ts">
import type { QuillOptions } from 'quill';
import { defineComponent, type PropType, type StyleValue } from 'vue';
import BaseEditableHolder from '../core/baseeditableholder/BaseEditableHolder.vue';
import EditorStyle from './style/EditorStyle';

export default defineComponent({
    name: 'BaseEditor',
    extends: BaseEditableHolder,
    props: {
        placeholder: String,
        readonly: Boolean,
        formats: Array as PropType<string[]>,
        editorStyle: [String, Object, Array] as PropType<StyleValue>,
        modules: Object as PropType<QuillOptions['modules']>
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
