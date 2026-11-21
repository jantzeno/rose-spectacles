import { ref, toValue, useId as vueUseId } from 'vue';

export function useId(initialValue?: string) {
    const idx = vueUseId();
    const id = ref(initialValue);

    return toValue(id) || `pv_id${toValue(idx)?.replaceAll(/v-|-/g, '_')}`;
}
