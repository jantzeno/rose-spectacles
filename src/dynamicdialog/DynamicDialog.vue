<template>
    <template v-for="(instance, key) in instanceMap" :key="key">
        <DDialog
            v-model:visible="instance.visible"
            :_instance="instance"
            v-bind="instance.options.props"
            @hide="onDialogHide(instance)"
            @after-hide="onDialogAfterHide(instance)"
        >
            <template v-if="instance.options.templates && instance.options.templates.header" #header>
                <component
                    v-for="(header, index) in getTemplateItems(instance.options.templates.header)"
                    :is="header"
                    :key="index + '_header'"
                    v-bind="instance.options.emits"
                ></component>
            </template>
            <component :is="instance.content" v-bind="instance.options.emits"></component>
            <template v-if="instance.options.templates && instance.options.templates.footer" #footer>
                <component
                    v-for="(footer, index) in getTemplateItems(instance.options.templates.footer)"
                    :is="footer"
                    :key="index + '_footer'"
                    v-bind="instance.options.emits"
                ></component>
            </template>
        </DDialog>
    </template>
</template>

<script lang="ts">
import type { DynamicDialogInstance } from 'rose-spectacles/dynamicdialogoptions';
import { defineComponent } from 'vue';
import { uuid } from '../internal/utils/index';
import Dialog from '../dialog/Dialog.vue';
import DynamicDialogEventBus from '../dynamicdialogeventbus/DynamicDialogEventBus';
import BaseDynamicDialog from './BaseDynamicDialog.vue';

type LiveDialog = DynamicDialogInstance & { key: string; visible: boolean };

export default defineComponent({
    name: 'DynamicDialog',
    extends: BaseDynamicDialog,
    inheritAttrs: false,
    data() {
        return {
            instanceMap: {} as Record<string, LiveDialog>,
            currentInstanceKey: null as string | null
        };
    },
    mounted() {
        DynamicDialogEventBus.on('open', this.onOpen);
        DynamicDialogEventBus.on('close', this.onClose);
    },
    beforeUnmount() {
        DynamicDialogEventBus.off('open', this.onOpen);
        DynamicDialogEventBus.off('close', this.onClose);
    },
    methods: {
        onOpen(event: unknown) {
            const { instance } = event as { instance: LiveDialog };
            const key = uuid() + '_dynamic_dialog';

            instance.visible = true;
            instance.key = key;
            this.instanceMap[key] = instance;
        },
        onClose(event: unknown) {
            const { instance, params } = event as { instance: LiveDialog; params?: unknown };
            const currentInstance = this.instanceMap[instance.key];

            if (currentInstance) {
                currentInstance.visible = false;
                currentInstance.options.onClose?.({ data: params, type: 'config-close' });
                this.currentInstanceKey = currentInstance.key;
            }
        },
        onDialogHide(instance: LiveDialog) {
            if (!this.currentInstanceKey) instance.options.onClose?.({ type: 'dialog-close' });
        },
        onDialogAfterHide(instance: LiveDialog) {
            this.currentInstanceKey = null;
            delete this.instanceMap[instance.key];
        },
        getTemplateItems<T>(template: T | T[]) {
            return Array.isArray(template) ? template : [template];
        }
    },
    components: {
        DDialog: Dialog
    }
});
</script>
