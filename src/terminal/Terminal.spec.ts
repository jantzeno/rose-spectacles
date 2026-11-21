import { mount } from '@vue/test-utils';
import TerminalService from '../terminalservice/TerminalService';
import Terminal from './Terminal.vue';

describe('Terminal.vue', () => {
    it.each([
        ['d', 'Valid command'],
        ['invalid', 'Unknown command: invalid']
    ])('displays the response to command %s', async (command, response) => {
        const commandHandler = (text: unknown) => {
            const [name] = String(text).split(' ');
            TerminalService.emit('response', name === 'd' ? 'Valid command' : 'Unknown command: ' + name);
        };

        TerminalService.on('command', commandHandler);
        const wrapper = mount(Terminal, {
            props: {
                welcomeMessage: 'Welcome to Rose Spectacles',
                prompt: '$'
            }
        });

        try {
            const input = wrapper.get<HTMLInputElement>('input.rs-terminal-prompt-value');
            expect(wrapper.get('.rs-terminal').text()).toContain('Welcome to Rose Spectacles');

            await input.setValue(command);
            await input.trigger('keydown', { key: 'Enter' });

            expect(wrapper.get('.rs-terminal-command-value').text()).toBe(command);
            expect(wrapper.get('.rs-terminal-command-response').text()).toBe(response);
            expect(input.element.value).toBe('');
        } finally {
            wrapper.unmount();
            TerminalService.off('command', commandHandler);
        }
    });
});
