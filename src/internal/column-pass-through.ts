import { camelize, type VNode } from 'vue';
import { getVNodeProp } from '../core/utils/Utils';

export function getColumnPassThroughProps(column: VNode | null | undefined) {
    const props = column?.props;
    if (!props) return {};

    let normalized: typeof props | undefined;
    for (const key of Object.keys(props)) {
        const name = camelize(key);
        if (name === key) continue;

        normalized ??= { ...props };
        normalized[name] = getVNodeProp(column, name);
    }

    return normalized ?? props;
}
