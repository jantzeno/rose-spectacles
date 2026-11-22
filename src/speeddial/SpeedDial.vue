<template>
    <div :ref="containerRef" :class="containerClass" :style="[style, sx('root')]" v-bind="ptmi('root')">
        <slot name="button" :visible="d_visible" :toggleCallback="onClick">
            <Button
                :class="[cx('pcButton'), buttonClass]"
                :disabled="disabled"
                :aria-expanded="d_visible"
                :aria-haspopup="true"
                :aria-controls="d_visible ? $id + '_list' : undefined"
                :aria-label="ariaLabel"
                :aria-labelledby="ariaLabelledby"
                :unstyled="unstyled"
                @click="onClick($event)"
                @keydown="onTogglerKeydown"
                v-bind="buttonProps"
                :pt="ptm('pcButton')"
            >
                <template #icon="slotProps">
                    <slot name="icon" :visible="d_visible">
                        <component
                            v-if="d_visible && !!hideIcon"
                            :is="hideIcon ? 'span' : 'PlusIcon'"
                            :class="[hideIcon, slotProps.class]"
                            v-bind="ptm('pcButton')['icon']"
                            data-pc-section="icon"
                        />
                        <component
                            v-else
                            :is="showIcon ? 'span' : 'PlusIcon'"
                            :class="[d_visible && !!hideIcon ? hideIcon : showIcon, slotProps.class]"
                            v-bind="ptm('pcButton')['icon']"
                            data-pc-section="icon"
                        />
                    </slot>
                </template>
            </Button>
        </slot>
        <ul
            :ref="listRef"
            :id="$id + '_list'"
            :class="cx('list')"
            :style="sx('list')"
            role="menu"
            tabindex="-1"
            @focus="onFocus"
            @blur="onBlur"
            @keydown="onKeyDown"
            v-bind="ptm('list')"
        >
            <template v-for="(item, index) of model" :key="index">
                <li
                    v-if="isItemVisible(item)"
                    :id="`${$id}_${index}`"
                    :class="cx('item', { id: `${$id}_${index}`, item })"
                    :style="getItemStyle(index)"
                    role="none"
                    :aria-disabled="isItemDisabled(item)"
                    :data-p-active="isItemActive(`${$id}_${index}`)"
                    :data-p-disabled="isItemDisabled(item) || false"
                    v-bind="getPTOptions(`${$id}_${index}`, 'item')"
                >
                    <template v-if="!$slots.item">
                        <Button
                            v-tooltip:[tooltipOptions]="{ value: item.label, disabled: !tooltipOptions }"
                            :tabindex="-1"
                            role="menuitem"
                            :class="cx('pcAction', { item })"
                            :aria-label="item.label == null ? undefined : String(item.label)"
                            :disabled="disabled || isItemDisabled(item)"
                            :unstyled="unstyled"
                            @click="onItemClick($event, item)"
                            v-bind="actionButtonProps"
                            :pt="getPTOptions(`${$id}_${index}`, 'pcAction')"
                        >
                            <template v-if="item.icon" #icon="slotProps">
                                <slot name="itemicon" :item="item" :class="slotProps.class">
                                    <span :class="[item.icon, slotProps.class]" v-bind="getPTOptions(`${$id}_${index}`, 'actionIcon')"></span>
                                </slot>
                            </template>
                        </Button>
                    </template>
                    <component
                        v-else
                        :is="$slots.item"
                        :item="item"
                        :onClick="(event: MouseEvent) => onItemClick(event, item)"
                        :toggleCallback="(event: MouseEvent) => onItemClick(event, item)"
                    ></component>
                </li>
            </template>
        </ul>
    </div>
    <Transition name="rs-overlay-mask">
        <div v-if="mask && d_visible" :class="[cx('mask'), maskClass]" :style="maskStyle" v-bind="ptm('mask')"></div>
    </Transition>
</template>

<script lang="ts">
import { $dt } from '../internal/styled/index';
import { find, findSingle, focus } from '../internal/utils/dom/index';
import { PlusIcon } from '../internal/lucide';
import Button from '../button/Button.vue';
import Ripple from '../ripple/Ripple';
import Tooltip from '../tooltip/Tooltip';
import { defineComponent, type ComponentPublicInstance } from 'vue';
import type { MenuItem } from '../menuitem/MenuItem';
import BaseSpeedDial from './BaseSpeedDial.vue';

// Set fix value for SSR.
const Math_PI = 3.14159265358979;

export default defineComponent({
    name: 'SpeedDial',
    extends: BaseSpeedDial,
    inheritAttrs: false,
    emits: ['click', 'show', 'hide', 'focus', 'blur'],
    data() {
        return {
            d_visible: this.visible,
            isItemClicked: false,
            focusedOptionIndex: -1 as string | -1,
            documentClickListener: null as ((event: MouseEvent) => void) | null,
            container: null as HTMLElement | null,
            list: null as HTMLElement | null
        };
    },
    watch: {
        visible(newValue) {
            this.d_visible = newValue;
        }
    },
    mounted() {
        if (this.type !== 'linear' && this.container && this.list) {
            const button = findSingle(this.container, '[data-pc-name="pcbutton"]');
            const firstItem = findSingle(this.list, '[data-pc-section="item"]');

            if (button instanceof HTMLElement && firstItem instanceof HTMLElement) {
                const wDiff = Math.abs(button.offsetWidth - firstItem.offsetWidth);
                const hDiff = Math.abs(button.offsetHeight - firstItem.offsetHeight);

                this.list.style.setProperty($dt('item.diff.x').name, `${wDiff / 2}px`);
                this.list.style.setProperty($dt('item.diff.y').name, `${hDiff / 2}px`);
            }
        }

        if (this.hideOnClickOutside) {
            this.bindDocumentClickListener();
        }
    },
    beforeUnmount() {
        this.unbindDocumentClickListener();
    },
    methods: {
        getPTOptions(id: string, key: string) {
            return this.ptm(key, {
                context: {
                    active: this.isItemActive(id),
                    hidden: !this.d_visible
                }
            });
        },
        onFocus(event: FocusEvent) {
            this.$emit('focus', event);
        },
        onBlur(event: FocusEvent | KeyboardEvent) {
            this.focusedOptionIndex = -1;
            this.$emit('blur', event);
        },
        onItemClick(e: MouseEvent | KeyboardEvent, item: MenuItem) {
            if (this.isItemDisabled(item)) {
                e.preventDefault();

                return;
            }

            if (item.command) {
                item.command({ originalEvent: e, item });
            }

            this.hide();

            this.isItemClicked = true;
            e.preventDefault();
        },
        onClick(event: MouseEvent) {
            this.d_visible ? this.hide() : this.show();
            this.isItemClicked = true;
            this.$emit('click', event);
        },
        show() {
            this.d_visible = true;
            this.$emit('show');
        },
        hide() {
            this.d_visible = false;
            this.$emit('hide');
        },
        calculateTransitionDelay(index: number) {
            const length = this.model?.length ?? 0;
            const visible = this.d_visible;

            return (visible ? index : length - index - 1) * this.transitionDelay;
        },
        onTogglerKeydown(event: KeyboardEvent) {
            switch (event.code) {
                case 'ArrowDown':
                case 'ArrowLeft':
                    this.onTogglerArrowDown(event);

                    break;

                case 'ArrowUp':
                case 'ArrowRight':
                    this.onTogglerArrowUp(event);

                    break;

                case 'Escape':
                    this.onEscapeKey();

                    break;

                default:
                    break;
            }
        },
        onKeyDown(event: KeyboardEvent) {
            switch (event.code) {
                case 'ArrowDown':
                    this.onArrowDown(event);
                    break;

                case 'ArrowUp':
                    this.onArrowUp(event);
                    break;

                case 'ArrowLeft':
                    this.onArrowLeft(event);
                    break;

                case 'ArrowRight':
                    this.onArrowRight(event);
                    break;

                case 'Enter':
                case 'NumpadEnter':
                case 'Space':
                    this.onEnterKey(event);
                    break;

                case 'Escape':
                    this.onEscapeKey();
                    break;

                case 'Home':
                    this.onHomeKey(event);
                    break;

                case 'End':
                    this.onEndKey(event);
                    break;

                default:
                    break;
            }
        },
        onTogglerArrowUp(event: KeyboardEvent) {
            this.show();
            this.navigatePrevItem(event);

            event.preventDefault();
        },
        onTogglerArrowDown(event: KeyboardEvent) {
            this.show();
            this.navigateNextItem(event);

            event.preventDefault();
        },
        onEnterKey(event: KeyboardEvent) {
            const item = this.model?.find((_, index) => `${this.$id}_${index}` === this.focusedOptionIndex);

            if (!item) return;

            const buttonEl = this.container?.querySelector('button');

            this.onItemClick(event, item);
            this.onBlur(event);

            buttonEl && focus(buttonEl);
        },
        onEscapeKey() {
            this.hide();

            const buttonEl = this.container?.querySelector('button');

            buttonEl && focus(buttonEl);
        },
        onArrowUp(event: KeyboardEvent) {
            if (this.direction === 'down') {
                this.navigatePrevItem(event);
            } else {
                this.navigateNextItem(event);
            }
        },
        onArrowDown(event: KeyboardEvent) {
            if (this.direction === 'down') {
                this.navigateNextItem(event);
            } else {
                this.navigatePrevItem(event);
            }
        },

        onArrowLeft(event: KeyboardEvent) {
            const leftValidDirections = ['left', 'up-right', 'down-left'];
            const rightValidDirections = ['right', 'up-left', 'down-right'];

            if (leftValidDirections.includes(this.direction)) {
                this.navigateNextItem(event);
            } else if (rightValidDirections.includes(this.direction)) {
                this.navigatePrevItem(event);
            } else {
                this.navigatePrevItem(event);
            }
        },

        onArrowRight(event: KeyboardEvent) {
            const leftValidDirections = ['left', 'up-right', 'down-left'];
            const rightValidDirections = ['right', 'up-left', 'down-right'];

            if (leftValidDirections.includes(this.direction)) {
                this.navigatePrevItem(event);
            } else if (rightValidDirections.includes(this.direction)) {
                this.navigateNextItem(event);
            } else {
                this.navigateNextItem(event);
            }
        },
        onEndKey(event: KeyboardEvent) {
            event.preventDefault();

            this.focusedOptionIndex = -1;
            this.navigatePrevItem(event);
        },
        onHomeKey(event: KeyboardEvent) {
            event.preventDefault();

            this.focusedOptionIndex = -1;
            this.navigateNextItem(event);
        },
        navigateNextItem(event: KeyboardEvent) {
            const optionIndex = this.findNextOptionIndex(this.focusedOptionIndex);

            this.changeFocusedOptionIndex(optionIndex);

            event.preventDefault();
        },
        navigatePrevItem(event: KeyboardEvent) {
            const optionIndex = this.findPrevOptionIndex(this.focusedOptionIndex);

            this.changeFocusedOptionIndex(optionIndex);

            event.preventDefault();
        },
        changeFocusedOptionIndex(index: number) {
            const items = this.container ? find(this.container, '[data-pc-section="item"]') : [];
            const filteredItems = [...items].filter((item) => item.getAttribute('data-p-disabled') !== 'true');

            if (filteredItems[index]) {
                this.focusedOptionIndex = filteredItems[index].id;
                const buttonEl = filteredItems[index].querySelector<HTMLButtonElement>('[type="button"]');

                buttonEl && focus(buttonEl);
            }
        },
        findPrevOptionIndex(index: string | -1) {
            const items = this.container ? find(this.container, '[data-pc-section="item"]') : [];
            const enabledItems = items.filter((item) => item.getAttribute('data-p-disabled') !== 'true');

            return index === -1 ? enabledItems.length - 1 : enabledItems.findIndex((item) => item.id === index) - 1;
        },
        findNextOptionIndex(index: string | -1) {
            const items = this.container ? find(this.container, '[data-pc-section="item"]') : [];
            const enabledItems = items.filter((item) => item.getAttribute('data-p-disabled') !== 'true');

            return index === -1 ? 0 : enabledItems.findIndex((item) => item.id === index) + 1;
        },
        calculatePointStyle(index: number) {
            const type = this.type;

            if (type !== 'linear') {
                const length = this.model?.length ?? 0;
                const radius = this.radius || length * 20;

                if (type === 'circle') {
                    const step = (2 * Math_PI) / length;

                    return {
                        left: `calc(${radius * Math.cos(step * index)}px + ${$dt('item.diff.x').variable})`,
                        top: `calc(${radius * Math.sin(step * index)}px + ${$dt('item.diff.y').variable})`
                    };
                } else if (type === 'semi-circle') {
                    const direction = this.direction;
                    const step = Math_PI / (length - 1);
                    const x = `calc(${radius * Math.cos(step * index)}px + ${$dt('item.diff.x').variable})`;
                    const y = `calc(${radius * Math.sin(step * index)}px + ${$dt('item.diff.y').variable})`;

                    if (direction === 'up') {
                        return { left: x, bottom: y };
                    } else if (direction === 'down') {
                        return { left: x, top: y };
                    } else if (direction === 'left') {
                        return { right: y, top: x };
                    } else if (direction === 'right') {
                        return { left: y, top: x };
                    }
                } else if (type === 'quarter-circle') {
                    const direction = this.direction;
                    const step = Math_PI / (2 * (length - 1));
                    const x = `calc(${radius * Math.cos(step * index)}px + ${$dt('item.diff.x').variable})`;
                    const y = `calc(${radius * Math.sin(step * index)}px + ${$dt('item.diff.y').variable})`;

                    if (direction === 'up-left') {
                        return { right: x, bottom: y };
                    } else if (direction === 'up-right') {
                        return { left: x, bottom: y };
                    } else if (direction === 'down-left') {
                        return { right: y, top: x };
                    } else if (direction === 'down-right') {
                        return { left: y, top: x };
                    }
                }
            }

            return {};
        },
        getItemStyle(index: number) {
            const transitionDelay = this.calculateTransitionDelay(index);
            const pointStyle = this.calculatePointStyle(index);

            return {
                transitionDelay: `${transitionDelay}ms`,
                ...pointStyle
            };
        },
        bindDocumentClickListener() {
            if (!this.documentClickListener) {
                this.documentClickListener = (event) => {
                    if (this.d_visible && this.isOutsideClicked(event)) {
                        this.hide();
                    }

                    this.isItemClicked = false;
                };

                document.addEventListener('click', this.documentClickListener);
            }
        },
        unbindDocumentClickListener() {
            if (this.documentClickListener) {
                document.removeEventListener('click', this.documentClickListener);
                this.documentClickListener = null;
            }
        },
        isOutsideClicked(event: MouseEvent) {
            return this.container && event.target instanceof Node && !this.container.contains(event.target) && !this.isItemClicked;
        },
        isItemVisible(item: MenuItem) {
            return typeof item.visible === 'function' ? item.visible() : item.visible !== false;
        },
        isItemDisabled(item: MenuItem) {
            return typeof item.disabled === 'function' ? item.disabled() : !!item.disabled;
        },
        isItemActive(id: string) {
            return id === this.focusedOptionId;
        },
        containerRef(el: Element | ComponentPublicInstance | null) {
            this.container = el instanceof HTMLElement ? el : null;
        },
        listRef(el: Element | ComponentPublicInstance | null) {
            this.list = el instanceof HTMLElement ? el : null;
        }
    },
    computed: {
        containerClass() {
            return [this.cx('root'), this.class];
        },
        focusedOptionId() {
            return this.focusedOptionIndex !== -1 ? this.focusedOptionIndex : null;
        }
    },
    components: {
        Button,
        PlusIcon
    },
    directives: {
        ripple: Ripple,
        tooltip: Tooltip
    }
});
</script>
