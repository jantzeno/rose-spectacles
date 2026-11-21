<template>
    <div :class="cx('root')" @click="onClick" v-bind="ptmi('root')">
        <div v-if="welcomeMessage" :class="cx('welcomeMessage')" v-bind="ptm('welcomeMessage')">{{ welcomeMessage }}</div>
        <div :class="cx('commandList')" v-bind="ptm('content')">
            <div v-for="(command, i) of commands" :key="command.text + i.toString()" :class="cx('command')" v-bind="ptm('commands')">
                <span :class="cx('promptLabel')" v-bind="ptm('prompt')">{{ prompt }}</span>
                <span :class="cx('commandValue')" v-bind="ptm('command')">{{ command.text }}</span>
                <div :class="cx('commandResponse')" aria-live="polite" v-bind="ptm('response')">{{ command.response }}</div>
            </div>
        </div>
        <div :class="cx('prompt')" v-bind="ptm('container')">
            <span :class="cx('promptLabel')" v-bind="ptm('prompt')">{{ prompt }}</span>
            <input
                ref="input"
                v-model="commandText"
                :class="cx('promptValue')"
                type="text"
                autocomplete="off"
                @keydown="onKeydown"
                v-bind="ptm('commandText')"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TerminalService from '../terminalservice/TerminalService';
import BaseTerminal from './BaseTerminal.vue';

interface TerminalCommand {
    text: string;
    response?: unknown;
}

export default defineComponent({
    name: 'Terminal',
    extends: BaseTerminal,
    inheritAttrs: false,
    data() {
        return {
            commandText: null as string | null,
            commands: [] as TerminalCommand[]
        };
    },
    mounted() {
        TerminalService.on('response', this.responseListener);
        (this.$refs.input as HTMLInputElement).focus();
    },
    updated() {
        this.$el.scrollTop = this.$el.scrollHeight;
    },
    beforeUnmount() {
        TerminalService.off('response', this.responseListener);
    },
    methods: {
        onClick() {
            (this.$refs.input as HTMLInputElement).focus();
        },
        onKeydown(event: KeyboardEvent) {
            if (event.key === 'Enter' && this.commandText) {
                this.commands.push({ text: this.commandText });
                TerminalService.emit('command', this.commandText);
                this.commandText = '';
            }
        },
        responseListener(response: unknown) {
            this.commands[this.commands.length - 1].response = response;
        }
    }
});
</script>
