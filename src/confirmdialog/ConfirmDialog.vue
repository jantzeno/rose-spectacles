<template>
    <Dialog
        v-model:visible="visible"
        role="alertdialog"
        :class="cx('root')"
        :modal="modal"
        :header="header"
        :blockScroll="blockScroll"
        :appendTo="appendTo"
        :position="position"
        :breakpoints="breakpoints"
        :closeOnEscape="closeOnEscape"
        :draggable="draggable"
        @update:visible="onHide"
        :pt="pt"
        :unstyled="unstyled"
    >
        <template v-if="$slots.container" #container="slotProps">
            <slot
                name="container"
                :message="confirmation"
                :closeCallback="slotProps.closeCallback"
                :acceptCallback="accept"
                :rejectCallback="reject"
                :initDragCallback="slotProps.initDragCallback"
            />
        </template>
        <template v-if="!$slots.container">
            <template v-if="!$slots.message">
                <slot name="icon">
                    <component v-if="$slots.icon" :is="$slots.icon" :class="cx('icon')" />
                    <span v-else-if="confirmation?.icon" :class="[confirmation?.icon, cx('icon')]" v-bind="ptm('icon')" />
                </slot>
                <span :class="cx('message')" v-bind="ptm('message')">{{ message }}</span>
            </template>
            <component v-else :is="$slots.message" :message="confirmation"></component>
        </template>
        <template v-if="!$slots.container" #footer>
            <Button
                :class="[cx('pcRejectButton'), confirmation?.rejectClass]"
                :autofocus="autoFocusReject"
                :unstyled="unstyled"
                :text="confirmation?.rejectProps?.text || false"
                @click="reject()"
                v-bind="confirmation?.rejectProps"
                :label="rejectLabel"
                :pt="ptm('pcRejectButton')"
            >
                <template v-if="rejectIcon || $slots.rejecticon" #icon="iconProps">
                    <slot name="rejecticon">
                        <span :class="[rejectIcon, iconProps.class]" v-bind="ptm('pcRejectButton')['icon']" data-pc-section="rejectbuttonicon" />
                    </slot>
                </template>
            </Button>
            <Button
                :label="acceptLabel"
                :class="[cx('pcAcceptButton'), confirmation?.acceptClass]"
                :autofocus="autoFocusAccept"
                :unstyled="unstyled"
                @click="accept()"
                v-bind="confirmation?.acceptProps"
                :pt="ptm('pcAcceptButton')"
            >
                <template v-if="acceptIcon || $slots.accepticon" #icon="iconProps">
                    <slot name="accepticon">
                        <span :class="[acceptIcon, iconProps.class]" v-bind="ptm('pcAcceptButton')['icon']" data-pc-section="acceptbuttonicon" />
                    </slot>
                </template>
            </Button>
        </template>
    </Dialog>
</template>

<script lang="ts">
import type { ConfirmationRenderOptions } from '../confirmationoptions/render-options';
import { defineComponent } from 'vue';
import Button from '../button/Button.vue';
import ConfirmationEventBus from '../confirmationeventbus/ConfirmationEventBus';
import Dialog from '../dialog/Dialog.vue';
import BaseConfirmDialog from './BaseConfirmDialog.vue';

export default defineComponent({
    name: 'ConfirmDialog',
    extends: BaseConfirmDialog,
    data() {
        return {
            visible: false,
            confirmation: null as ConfirmationRenderOptions | null
        };
    },
    mounted() {
        ConfirmationEventBus.on('confirm', this.onConfirm);
        ConfirmationEventBus.on('close', this.closeConfirmation);
    },
    beforeUnmount() {
        ConfirmationEventBus.off('confirm', this.onConfirm);
        ConfirmationEventBus.off('close', this.closeConfirmation);
    },
    methods: {
        onConfirm(event: unknown) {
            const options = event as ConfirmationRenderOptions | undefined;

            if (options && options.group === this.group) {
                this.confirmation = options;
                this.confirmation.onShow?.();
                this.visible = true;
            }
        },
        closeConfirmation() {
            this.visible = false;
            this.confirmation = null;
        },
        accept() {
            this.confirmation?.accept?.();

            this.visible = false;
        },
        reject() {
            this.confirmation?.reject?.();

            this.visible = false;
        },
        onHide() {
            this.confirmation?.onHide?.();

            this.visible = false;
        }
    },
    computed: {
        appendTo() {
            return this.confirmation ? this.confirmation.appendTo : 'body';
        },
        target() {
            return this.confirmation ? this.confirmation.target : null;
        },
        modal() {
            return this.confirmation ? (this.confirmation.modal == null ? true : this.confirmation.modal) : true;
        },
        header() {
            return this.confirmation ? this.confirmation.header : null;
        },
        message() {
            return this.confirmation ? this.confirmation.message : null;
        },
        blockScroll() {
            return this.confirmation ? this.confirmation.blockScroll : true;
        },
        position() {
            return this.confirmation?.position;
        },
        acceptLabel() {
            if (this.confirmation) {
                const confirmation = this.confirmation;

                return confirmation.acceptLabel || confirmation.acceptProps?.label || this.$primevue.config.locale?.accept;
            }

            return this.$primevue.config.locale?.accept;
        },
        rejectLabel() {
            if (this.confirmation) {
                const confirmation = this.confirmation;

                return confirmation.rejectLabel || confirmation.rejectProps?.label || this.$primevue.config.locale?.reject;
            }

            return this.$primevue.config.locale?.reject;
        },
        acceptIcon() {
            return this.confirmation ? this.confirmation.acceptIcon : null;
        },
        rejectIcon() {
            return this.confirmation ? this.confirmation.rejectIcon : null;
        },
        autoFocusAccept() {
            return this.confirmation?.defaultFocus === undefined || this.confirmation?.defaultFocus === 'accept' ? true : false;
        },
        autoFocusReject() {
            return this.confirmation?.defaultFocus === 'reject' ? true : false;
        },
        closeOnEscape() {
            return this.confirmation ? this.confirmation.closeOnEscape : true;
        }
    },
    components: {
        Dialog,
        Button
    }
});
</script>
