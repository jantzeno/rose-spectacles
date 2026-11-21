<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { getValueByPath } from '../../internal/form-values';
import { isEmpty, isNotEmpty } from '../../internal/utils/index';
import BaseComponent from '../basecomponent/BaseComponent.vue';

interface FieldControl {
    name?: string;
    novalidate?: boolean;
}

interface FieldState {
    value?: unknown;
    invalid?: boolean;
}

interface FieldRegistration {
    onInput?: (info: { originalEvent?: Event; value: unknown }) => void;
    onChange?: (info: { originalEvent?: Event; value: unknown }) => void;
    onBlur?: (event?: Event) => void;
}

interface InjectedForm {
    initialValues?: Record<string, unknown>;
    register?: (name: string | undefined, control?: FieldControl) => FieldRegistration;
    getFieldState: (name: string | undefined) => FieldState | undefined;
}

interface InjectedFormField {
    $field?: FieldState;
    formControl?: FieldControl;
    initialValue?: unknown;
}

export default defineComponent({
    name: 'BaseEditableHolder',
    extends: BaseComponent,
    emits: ['update:modelValue', 'value-change'],
    props: {
        modelValue: {
            type: null,
            default: undefined
        },
        defaultValue: {
            type: null,
            default: undefined
        },
        name: {
            type: String,
            default: undefined
        },
        invalid: {
            type: Boolean,
            default: undefined
        },
        disabled: {
            type: Boolean,
            default: false
        },
        formControl: {
            type: Object as PropType<FieldControl>,
            default: undefined
        }
    },
    inject: {
        $parentInstance: {
            default: undefined
        },
        $pcForm: {
            default: undefined as InjectedForm | undefined
        },
        $pcFormField: {
            default: undefined as InjectedFormField | undefined
        }
    },
    data() {
        return {
            d_value: this.defaultValue !== undefined ? this.defaultValue : this.modelValue,
            formField: {} as FieldRegistration
        };
    },
    watch: {
        modelValue: {
            deep: true,
            handler(newValue) {
                this.d_value = newValue;
            }
        },
        defaultValue(newValue) {
            this.d_value = newValue;
        },
        $formName: {
            immediate: true,
            handler(newValue) {
                this.formField = this.$formInstance?.register?.(newValue, this.$formControl) || {};
            }
        },
        $formControl: {
            immediate: true,
            handler(newValue) {
                this.formField = this.$formInstance?.register?.(this.$formName, newValue) || {};
            }
        },
        $formDefaultValue: {
            immediate: true,
            handler(newValue) {
                isEmpty(this.d_value) && this.d_value !== newValue && (this.d_value = newValue);
            }
        },
        $formValue: {
            immediate: false,
            handler(newValue) {
                if (this.$formInstance?.getFieldState(this.$formName) && newValue !== this.d_value) {
                    this.d_value = newValue;
                }
            }
        }
    },
    methods: {
        writeValue(value: unknown, event?: Event) {
            if (this.controlled) {
                this.d_value = value;
                this.$emit('update:modelValue', value);
            }

            this.$emit('value-change', value);

            this.formField.onChange?.({ originalEvent: event, value });
        },
        findNonEmpty<T>(...values: T[]) {
            return values.find(isNotEmpty);
        }
    },
    computed: {
        $formInstance(): InjectedForm | undefined {
            return this.$pcForm as InjectedForm | undefined;
        },
        $formFieldInstance(): InjectedFormField | undefined {
            return this.$pcFormField as InjectedFormField | undefined;
        },
        $filled() {
            return isNotEmpty(this.d_value);
        },
        $invalid() {
            return (
                !this.$formNovalidate &&
                this.findNonEmpty(this.invalid, this.$formFieldInstance?.$field?.invalid, this.$formInstance?.getFieldState(this.$formName)?.invalid)
            );
        },
        $formName() {
            return !this.$formNovalidate ? this.name || this.$formControl?.name : undefined;
        },
        $formControl() {
            return this.formControl || this.$formFieldInstance?.formControl;
        },
        $formNovalidate() {
            return this.$formControl?.novalidate;
        },
        $formDefaultValue() {
            return this.findNonEmpty(this.$formFieldInstance?.initialValue, getValueByPath(this.$formInstance?.initialValues, this.$formName));
        },
        $formValue() {
            return this.findNonEmpty(this.$formFieldInstance?.$field?.value, this.$formInstance?.getFieldState(this.$formName)?.value);
        },
        controlled() {
            return this.$inProps.hasOwnProperty('modelValue') || (!this.$inProps.hasOwnProperty('modelValue') && !this.$inProps.hasOwnProperty('defaultValue'));
        },
        // @deprecated use $filled instead
        filled() {
            return this.$filled;
        }
    }
});
</script>
