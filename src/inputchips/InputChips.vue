<template>
    <div :class="cx('root')" v-bind="ptmi('root')">
        <ul
            ref="container"
            :class="cx('input')"
            tabindex="-1"
            role="listbox"
            aria-orientation="horizontal"
            :aria-labelledby="ariaLabelledby"
            :aria-label="ariaLabel"
            :aria-activedescendant="focused ? (focusedOptionId ?? undefined) : undefined"
            @click="onWrapperClick()"
            @focus="onContainerFocus"
            @blur="onContainerBlur"
            @keydown="onContainerKeyDown"
            v-bind="ptm('input')"
        >
            <li
                v-for="(val, i) of modelValue"
                :key="`${i}_${val}`"
                :id="$id + '_inputchips_item_' + i"
                role="option"
                :class="cx('chipItem', { index: i })"
                :aria-label="val as string | undefined"
                :aria-selected="true"
                :aria-setsize="modelValue?.length"
                :aria-posinset="i + 1"
                v-bind="ptm('chipItem')"
                :data-p-focused="focusedIndex === i"
            >
                <slot name="chip" :class="cx('pcChip')" :index="i" :value="val" :removeCallback="(event: Event) => removeItem(event, i)">
                    <!-- TODO: removetokenicon and removeTokenIcon  deprecated since v4.0. Use chipicon slot and chipIcon prop-->
                    <Chip
                        :class="cx('pcChip')"
                        :label="val as string | undefined"
                        :removeIcon="chipIcon || removeTokenIcon"
                        removable
                        :unstyled="unstyled"
                        @remove="removeItem($event, i)"
                        :pt="ptm('pcChip')"
                    >
                        <template #removeicon>
                            <slot
                                :name="$slots.chipicon ? 'chipicon' : 'removetokenicon'"
                                :class="cx('chipIcon')"
                                :index="i"
                                :removeCallback="(event: Event) => removeItem(event, i)"
                            />
                        </template>
                    </Chip>
                </slot>
            </li>
            <li :class="cx('inputItem')" role="option" v-bind="ptm('inputItem')">
                <input
                    ref="input"
                    :id="inputId"
                    type="text"
                    :class="inputClass"
                    :style="inputStyle"
                    :disabled="disabled || maxedOut"
                    :placeholder="placeholder"
                    :aria-invalid="invalid || undefined"
                    @focus="onFocus($event)"
                    @blur="onBlur($event)"
                    @input="onInput"
                    @keydown="onKeyDown($event)"
                    @paste="onPaste($event)"
                    v-bind="{ ...inputProps, ...ptm('inputItemField') }"
                />
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Chip from '../chip/Chip.vue';
import BaseInputChips from './BaseInputChips.vue';

export default defineComponent({
    name: 'InputChips',
    extends: BaseInputChips,
    inheritAttrs: false,
    emits: ['update:modelValue', 'add', 'remove', 'focus', 'blur'],
    data() {
        return {
            inputValue: '',
            focused: false,
            focusedIndex: null as number | null
        };
    },
    mounted() {
        console.warn('Deprecated since v4. Use AutoComplete component instead with its typeahead property.');
    },
    methods: {
        onWrapperClick() {
            (this.$refs.input as HTMLInputElement).focus();
        },
        onInput(event: Event) {
            this.inputValue = (event.target as HTMLInputElement).value;
            this.focusedIndex = null;
        },
        onFocus(event: FocusEvent) {
            this.focused = true;
            this.focusedIndex = null;
            this.$emit('focus', event);
        },
        onBlur(event: FocusEvent) {
            this.focused = false;
            this.focusedIndex = null;

            if (this.addOnBlur) {
                this.addItem(event, (event.target as HTMLInputElement).value, false);
            }

            this.$emit('blur', event);
        },
        onKeyDown(event: KeyboardEvent) {
            if (event.isComposing) return;

            const inputValue = (event.target as HTMLInputElement).value;

            switch (event.code) {
                case 'Backspace':
                    if (inputValue.length === 0 && this.modelValue && this.modelValue.length > 0) {
                        if (this.focusedIndex !== null) {
                            this.removeItem(event, this.focusedIndex);
                        } else this.removeItem(event, this.modelValue.length - 1);
                    }

                    break;

                case 'Enter':
                case 'NumpadEnter':
                    if (inputValue && inputValue.trim().length && !this.maxedOut) {
                        this.addItem(event, inputValue, true);
                    }

                    break;

                case 'ArrowLeft':
                    if (inputValue.length === 0 && this.modelValue && this.modelValue.length > 0) {
                        (this.$refs.container as HTMLElement).focus();
                    }

                    break;

                case 'ArrowRight':
                    event.stopPropagation();
                    break;

                default:
                    if (this.separator) {
                        if (this.separator === event.key || event.key.match(this.separator)) {
                            this.addItem(event, inputValue, true);
                        }
                    }

                    break;
            }
        },
        onPaste(event: ClipboardEvent) {
            if (this.separator) {
                const separator =
                    typeof this.separator === 'string' ? this.separator.replace('\\n', '\n').replace('\\r', '\r').replace('\\t', '\t') : this.separator;
                const legacyClipboard = (window as Window & { clipboardData?: DataTransfer }).clipboardData;
                const pastedData = (event.clipboardData ?? legacyClipboard)?.getData('Text');

                if (pastedData) {
                    let value = this.modelValue || [];
                    let pastedValues = pastedData.split(separator);

                    pastedValues = pastedValues.filter((val) => this.allowDuplicate || value.indexOf(val) === -1);
                    value = [...value, ...pastedValues];
                    this.updateModel(event, value, true);
                }
            }
        },
        onContainerFocus() {
            this.focused = true;
        },
        onContainerBlur() {
            this.focusedIndex = -1;
            this.focused = false;
        },
        onContainerKeyDown(event: KeyboardEvent) {
            if (event.isComposing) return;

            switch (event.code) {
                case 'ArrowLeft':
                    this.onArrowLeftKeyOn();
                    break;

                case 'ArrowRight':
                    this.onArrowRightKeyOn();
                    break;

                case 'Backspace':
                    this.onBackspaceKeyOn(event);
                    break;

                default:
                    break;
            }
        },
        onArrowLeftKeyOn() {
            if (this.inputValue.length === 0 && this.modelValue && this.modelValue.length > 0) {
                this.focusedIndex = this.focusedIndex === null ? this.modelValue.length - 1 : this.focusedIndex - 1;
                if (this.focusedIndex < 0) this.focusedIndex = 0;
            }
        },
        onArrowRightKeyOn() {
            if (this.inputValue.length === 0 && this.modelValue && this.modelValue.length > 0) {
                if (this.focusedIndex === this.modelValue.length - 1) {
                    this.focusedIndex = null;
                    this.onWrapperClick();
                } else {
                    this.focusedIndex = (this.focusedIndex ?? 0) + 1;
                }
            }
        },
        onBackspaceKeyOn(event: KeyboardEvent) {
            if (this.focusedIndex !== null) {
                this.removeItem(event, this.focusedIndex);
            }
        },
        updateModel(event: Event, value: unknown[], preventDefault: boolean) {
            this.$emit('update:modelValue', value);
            this.$emit('add', {
                originalEvent: event,
                value: value
            });
            (this.$refs.input as HTMLInputElement).value = '';
            this.inputValue = '';

            setTimeout(() => {
                this.maxedOut && (this.focused = false);
            }, 0);

            if (preventDefault) {
                event.preventDefault();
            }
        },
        addItem(event: Event, item: string, preventDefault: boolean) {
            if (item && item.trim().length) {
                let value = this.modelValue ? [...this.modelValue] : [];

                if (this.allowDuplicate || value.indexOf(item) === -1) {
                    value.push(item);
                    this.updateModel(event, value, preventDefault);

                    return;
                }
            }

            if (preventDefault) {
                event.preventDefault();
            }
        },
        removeItem(event: Event, index: number) {
            if (this.disabled) {
                return;
            }

            const values = [...(this.modelValue ?? [])];
            const removedItem = values.splice(index, 1);

            this.focusedIndex = null;
            this.onWrapperClick();
            this.$emit('update:modelValue', values);
            this.$emit('remove', {
                originalEvent: event,
                value: removedItem
            });
        }
    },
    computed: {
        maxedOut() {
            return !!this.max && this.max === this.modelValue?.length;
        },
        focusedOptionId() {
            return this.focusedIndex !== null ? `${this.$id}_inputchips_item_${this.focusedIndex}` : null;
        }
    },
    components: {
        Chip
    }
});
</script>
