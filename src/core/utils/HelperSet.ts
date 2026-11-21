import { isNotEmpty } from '../../internal/utils/object/index';
import { isVNode, type ComponentInternalInstance, type Slots, type VNode } from 'vue';

interface HelperOptions {
    init?: Iterable<ComponentInternalInstance>;
    type: string;
}

interface SlotOwner {
    $slots?: Slots;
}

export default class HelperSet {
    helpers: Set<ComponentInternalInstance>;
    type: string;

    constructor({ init, type }: HelperOptions) {
        this.helpers = new Set(init);
        this.type = type;
    }
    add(instance: ComponentInternalInstance) {
        this.helpers.add(instance);
    }
    update() {
        // @todo
    }
    delete(instance: ComponentInternalInstance) {
        this.helpers.delete(instance);
    }
    clear() {
        this.helpers.clear();
    }
    get(parentInstance: SlotOwner | VNode, slots?: VNode['children']) {
        const children = this._get(parentInstance, slots);
        const computed = children ? this._recursive([...this.helpers], children) : null;

        return isNotEmpty(computed) ? computed : null;
    }
    _isMatched(instance: ComponentInternalInstance, key: VNode['key']): boolean {
        const parent = instance?.parent;

        return parent?.vnode?.key === key || (parent && this._isMatched(parent, key)) || false;
    }
    _get(parentInstance: SlotOwner | VNode, slots?: VNode['children']) {
        const ownerSlots = '$slots' in parentInstance ? parentInstance.$slots : undefined;
        const source = slots || ownerSlots;
        const value = source && typeof source === 'object' && 'default' in source && typeof source.default === 'function' ? source.default() : null;

        return Array.isArray(value) ? value : isVNode(value) ? [value] : null;
    }
    _recursive(helpers: ComponentInternalInstance[] = [], children: unknown[] = []): VNode[] {
        let components: VNode[] = [];

        children.forEach((child) => {
            if (Array.isArray(child)) {
                components = components.concat(this._recursive(helpers, child));
            } else if (!isVNode(child)) {
                return;
            } else if (Array.isArray(child.children)) {
                components = components.concat(this._recursive(helpers, child.children));
            } else if ((typeof child.type === 'object' || typeof child.type === 'function') && 'name' in child.type && child.type.name === this.type) {
                components.push(child);
            } else if (isNotEmpty(child.key)) {
                components = components.concat(helpers.filter((c) => this._isMatched(c, child.key)).map((c) => c.vnode));
            }
        });

        return components;
    }
}
