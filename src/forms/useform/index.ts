import type { useFormFieldInstance, useFormFieldOptions, useFormFieldProps, useFormFieldState, useFormOptions } from 'rose-spectacles/forms/useform';
import { getValueByPath } from '../../internal/form-values';
import { isArray, isEmpty, isNotEmpty, mergeKeys, resolve } from '../../internal/utils/index';
import {
    computed,
    getCurrentInstance,
    mergeProps,
    nextTick,
    onMounted,
    reactive,
    ref,
    toValue,
    watch,
    type WatchCallback,
    type WatchOptions,
    type WatchSource
} from 'vue';

function tryOnMounted(fn: () => void, sync = true) {
    if (getCurrentInstance()) onMounted(fn);
    else if (sync) fn();
    else nextTick(fn);
}

function watchPausable<T>(source: WatchSource<T>, callback: WatchCallback<T>, options?: WatchOptions) {
    const isActive = ref(true);

    const stop = watch(
        source,
        (newValue, oldValue, onCleanup) => {
            if (!isActive.value) return;
            callback(newValue, oldValue, onCleanup);
        },
        options
    );

    return {
        stop,
        pause: () => {
            isActive.value = false;
        },
        resume: () => {
            isActive.value = true;
        }
    };
}

// @todo: move to utils
function groupKeys(obj: Record<string, unknown>) {
    return Object.entries(obj).reduce(
        (result, [key, value]) => {
            /* eslint-disable-next-line no-useless-escape */
            key.split(/[\.\[\]]+/)
                .filter(Boolean)
                .reduce((acc, curr, idx, arr) => (acc[curr] ??= Number.isNaN(Number(arr[idx + 1])) ? (idx === arr.length - 1 ? value : {}) : []), result);

            return result;
        },
        {} as Record<string, any>
    );
}

type Trigger = 'validateOnBlur' | 'validateOnValueUpdate' | 'validateOnMount' | 'validateOnSubmit';

export const useForm = (options: useFormOptions = {}) => {
    const _states = reactive<Record<string, useFormFieldState>>({});
    const fields = reactive<Record<string, useFormFieldInstance>>({});
    const valid = computed(() => Object.values(_states).every((field) => !field.invalid));
    const states = computed(() => groupKeys(_states));

    const getInitialState = (field: string, initialValue?: unknown): useFormFieldState => {
        return {
            value: initialValue ?? getValueByPath(options.initialValues, field),
            touched: false,
            dirty: false,
            pristine: true,
            valid: true,
            invalid: false,
            error: null,
            errors: []
        };
    };

    const isFieldValidate = (field: string, validateOn: useFormOptions[Trigger]) => {
        const value = resolve(validateOn, field);

        return value === true || (Array.isArray(value) && value.includes(field));
    };

    const validateOn = async (option: Trigger, defaultValue?: boolean) => {
        let results: Record<string, any> = {};

        const configured = options[option];
        if (Array.isArray(configured)) results = await validate(configured);
        else if (configured ?? defaultValue) results = await validate();
        const fieldArr = Object.keys(fields).filter((field) => fields[field]?.options?.[option]) || [];

        isNotEmpty(fieldArr) && (results = await validate(fieldArr));

        return results;
    };

    const validateFieldOn = (field: string, fieldOptions: useFormFieldOptions | undefined, option: Trigger, defaultValue?: boolean) => {
        (fieldOptions?.[option] ?? isFieldValidate(field, options[option] ?? defaultValue)) && validate(field);
    };

    const defineField = (field?: string, fieldOptions?: useFormFieldOptions): [] | [useFormFieldState, useFormFieldProps] => {
        if (!field) {
            //console.warn('The `name` attribute is required for the field definition.');

            return []; // prevent errors
        }

        fields[field]?._watcher.stop();

        _states[field] ||= getInitialState(field, fieldOptions?.initialValue);

        const resolvedOptions = resolve(fieldOptions, _states[field]) as useFormFieldOptions | undefined;
        const fieldProps = resolve(fieldOptions?.props, _states[field]) as Record<string, unknown> | undefined;
        const props = mergeProps((resolvedOptions?.props as Record<string, unknown> | undefined) ?? {}, fieldProps ?? {}, {
            name: field,
            onBlur: () => {
                _states[field].touched = true;
                validateFieldOn(field, fieldOptions, 'validateOnBlur');
            },
            onInput: (event: { value?: unknown; target: HTMLInputElement }) => {
                _states[field].value = event && Object.hasOwn(event, 'value') ? event.value : event.target.value;
            },
            onChange: (event: { value?: unknown; target: HTMLInputElement }) => {
                _states[field].value =
                    event && Object.hasOwn(event, 'value')
                        ? event.value
                        : event.target.type === 'checkbox' || event.target.type === 'radio'
                          ? event.target.checked
                          : event.target.value;
            },
            onInvalid: (errors: unknown[]) => {
                _states[field].invalid = true;
                _states[field].errors = errors;
                _states[field].error = errors?.[0] ?? null;
            }
        });

        const _watcher = watchPausable(
            () => _states[field].value,
            (newValue, oldValue) => {
                if (_states[field].pristine) {
                    _states[field].pristine = false;
                }

                if (newValue !== oldValue) {
                    _states[field].dirty = true;
                }

                validateFieldOn(field, fieldOptions, 'validateOnValueUpdate', true);
            }
        );

        fields[field] = { props: props as useFormFieldProps, states: _states[field], options: fieldOptions, _watcher };

        return [_states[field], props as useFormFieldProps];
    };

    const handleSubmit = (
        callback: (event: { originalEvent: Event; valid: boolean; states: Record<string, useFormFieldState>; reset: () => void }) => void
    ) => {
        return async (event: Event) => {
            const results = await validateOn('validateOnSubmit', true);

            return callback({
                originalEvent: event,
                valid: toValue(valid),
                states: toValue(states),
                reset,
                ...results
            });
        };
    };

    const handleReset = (callback: (event: { originalEvent: Event }) => void) => {
        return async (event: Event) => {
            reset();

            return callback({
                originalEvent: event
            });
        };
    };

    const validate = async (field?: string | string[]) => {
        const resolverOptions = Object.entries(_states).reduce(
            (acc, [key, val]) => {
                acc.names.push(key);
                acc.values[key] = val.value;

                return acc;
            },
            { names: [] as string[], values: {} as Record<string, unknown> }
        );

        const [names, values] = [resolverOptions.names, groupKeys(resolverOptions.values)];

        let result: Record<string, any> = (await options.resolver?.({ names, values })) ?? { values };

        result.errors ??= {};

        const flattenFields = [field].flat();

        for (const [fieldName, fieldInst] of Object.entries(fields)) {
            if (flattenFields.includes(fieldName) || !field || isEmpty(result.errors)) {
                const fieldResolver = fieldInst.options?.resolver;

                if (fieldResolver) {
                    const fieldValue = fieldInst.states.value;
                    const fieldResult = (await fieldResolver({ values: fieldValue, value: fieldValue, name: fieldName })) ?? { values: fieldValue };

                    isArray(fieldResult.errors) && (fieldResult.errors = { [fieldName]: fieldResult.errors });

                    result = mergeKeys(result, fieldResult);
                }

                const errors = getValueByPath(result.errors, fieldName) ?? [];

                //const value = result.values?.[fieldName] ?? _states[sField].value;
                _states[fieldName].invalid = errors.length > 0;
                _states[fieldName].valid = !_states[fieldName].invalid;
                _states[fieldName].errors = errors;
                _states[fieldName].error = errors?.[0] ?? null;
                //states[fieldName].value = value;
            }
        }

        return {
            ...result,
            errors: groupKeys(result.errors)
        };
    };

    const reset = () => {
        Object.keys(_states).forEach(async (field) => {
            const watcher = fields[field]._watcher;

            watcher.pause();
            fields[field].states = _states[field] = getInitialState(field, fields[field]?.options?.initialValue);
            await nextTick();
            watcher.resume();
        });
    };

    const setFieldValue = (field: string, value: unknown) => {
        if (_states[field] !== undefined) _states[field].value = value;
    };

    const getFieldState = (field: string) => {
        return fields[field]?.states;
    };

    const setValues = (values: Record<string, unknown>) => {
        Object.keys(values).forEach((field) => setFieldValue(field, values[field]));
    };

    const validateOnMounted = () => {
        validateOn('validateOnMount');
    };

    tryOnMounted(validateOnMounted);

    return {
        defineField,
        setFieldValue,
        getFieldState,
        handleSubmit,
        handleReset,
        validate,
        setValues,
        reset,
        valid,
        states,
        fields
    };
};
