import { mount } from '@vue/test-utils';
import FileUpload from './FileUpload.vue';

it('rejects extra dropped files at the queue limit and still allows uploading the accepted batch', async () => {
    const wrapper = mount(FileUpload, {
        props: { fileLimit: 2, multiple: true, customUpload: true, invalidFileLimitMessage: 'Only {0} files allowed' }
    });
    const files = ['first.txt', 'second.txt', 'extra.txt'].map((name) => new File(['data'], name, { type: 'text/plain' }));
    const dropZone = wrapper.get('.rs-fileupload-content');

    try {
        await dropZone.trigger('drop', { dataTransfer: { files: files.slice(0, 2) } });
        await dropZone.trigger('drop', { dataTransfer: { files: files.slice(2) } });

        const selection = wrapper.emitted<{ files: File[] }[]>('select')?.at(-1)?.[0];
        expect(selection?.files.map(({ name }) => name)).toEqual(['first.txt', 'second.txt']);
        expect(wrapper.text()).toContain('Only 2 files allowed');
        expect(wrapper.text()).not.toContain('extra.txt');

        const upload = wrapper.findAll('button').find((button) => button.text() === 'Upload');
        expect(upload?.attributes('disabled')).toBeUndefined();
        await upload?.trigger('click');
        expect(wrapper.emitted<{ files: File[] }[]>('uploader')?.[0]?.[0].files).toEqual(files.slice(0, 2));
    } finally {
        wrapper.unmount();
    }
});
