import { mount } from '@vue/test-utils';
import Dock from './Dock.vue';

it('invokes the command for a plain Dock menu item', async () => {
    const command = vi.fn();
    const wrapper = mount(Dock, { props: { model: [{ label: 'Inbox', command }] } });

    try {
        await wrapper.get('a').trigger('click');

        expect(command).toHaveBeenCalledTimes(1);
        expect(command).toHaveBeenCalledWith({ originalEvent: expect.any(MouseEvent), item: expect.objectContaining({ label: 'Inbox' }) });
    } finally {
        wrapper.unmount();
    }
});
