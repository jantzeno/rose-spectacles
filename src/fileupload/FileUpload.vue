<template>
    <div v-if="isAdvanced" :class="cx('root')" v-bind="ptmi('root')">
        <input
            :id="inputId"
            ref="fileInput"
            type="file"
            @change="onFileSelect"
            :multiple="multiple"
            :accept="accept"
            :disabled="chooseDisabled"
            v-bind="ptm('input')"
        />
        <div :class="cx('header')" v-bind="ptm('header')">
            <slot name="header" :files="files" :uploadedFiles="uploadedFiles" :chooseCallback="choose" :uploadCallback="uploader" :clearCallback="clear">
                <Button
                    :label="chooseButtonLabel"
                    :class="chooseButtonClass"
                    :style="style"
                    :disabled="disabled"
                    :unstyled="unstyled"
                    @click="choose"
                    @keydown.enter="choose"
                    @focus="onFocus"
                    @blur="onBlur"
                    v-bind="chooseButtonProps"
                    :pt="ptm('pcChooseButton')"
                >
                    <template #icon="iconProps">
                        <slot name="chooseicon">
                            <component
                                :is="chooseIcon ? 'span' : 'PlusIcon'"
                                :class="[iconProps.class, chooseIcon]"
                                aria-hidden="true"
                                v-bind="ptm('pcChooseButton')['icon']"
                            />
                        </slot>
                    </template>
                </Button>
                <Button
                    v-if="showUploadButton"
                    :class="cx('pcUploadButton')"
                    :label="uploadButtonLabel"
                    @click="uploader"
                    :disabled="uploadDisabled"
                    :unstyled="unstyled"
                    v-bind="uploadButtonProps"
                    :pt="ptm('pcUploadButton')"
                >
                    <template #icon="iconProps">
                        <slot name="uploadicon">
                            <component
                                :is="uploadIcon ? 'span' : 'UploadIcon'"
                                :class="[iconProps.class, uploadIcon]"
                                aria-hidden="true"
                                v-bind="ptm('pcUploadButton')['icon']"
                                data-pc-section="uploadbuttonicon"
                            />
                        </slot>
                    </template>
                </Button>
                <Button
                    v-if="showCancelButton"
                    :class="cx('pcCancelButton')"
                    :label="cancelButtonLabel"
                    @click="clear"
                    :disabled="cancelDisabled"
                    :unstyled="unstyled"
                    v-bind="cancelButtonProps"
                    :pt="ptm('pcCancelButton')"
                >
                    <template #icon="iconProps">
                        <slot name="cancelicon">
                            <component
                                :is="cancelIcon ? 'span' : 'TimesIcon'"
                                :class="[iconProps.class, cancelIcon]"
                                aria-hidden="true"
                                v-bind="ptm('pcCancelButton')['icon']"
                                data-pc-section="cancelbuttonicon"
                            />
                        </slot>
                    </template>
                </Button>
            </slot>
        </div>
        <div
            ref="content"
            :class="cx('content')"
            @dragenter="onDragEnter"
            @dragover="onDragOver"
            @dragleave="onDragLeave"
            @drop="onDrop"
            v-bind="ptm('content')"
            :data-p-highlight="false"
        >
            <slot
                name="content"
                :files="files"
                :uploadedFiles="uploadedFiles"
                :removeUploadedFileCallback="removeUploadedFile"
                :removeFileCallback="remove"
                :progress="progress"
                :messages="messages"
            >
                <ProgressBar v-if="hasFiles" :value="progress ?? undefined" :showValue="false" :unstyled="unstyled" :pt="ptm('pcProgressbar')" />
                <Message v-for="msg of messages" :key="msg" severity="error" @close="onMessageClose" :unstyled="unstyled" :pt="ptm('pcMessage')">{{
                    msg
                }}</Message>
                <div v-if="hasFiles" :class="cx('fileList')">
                    <FileContent
                        :files="files"
                        @remove="remove"
                        :badgeValue="pendingLabel"
                        :previewWidth="previewWidth"
                        :templates="$slots"
                        :unstyled="unstyled"
                        :pt="pt"
                    />
                </div>
                <div v-if="hasUploadedFiles" :class="cx('fileList')">
                    <FileContent
                        :files="uploadedFiles"
                        @remove="removeUploadedFile"
                        :badgeValue="completedLabel"
                        badgeSeverity="success"
                        :previewWidth="previewWidth"
                        :templates="$slots"
                        :unstyled="unstyled"
                        :pt="pt"
                    />
                </div>
            </slot>
            <div v-if="$slots.empty && !hasFiles && !hasUploadedFiles" v-bind="ptm('empty')">
                <slot name="empty"></slot>
            </div>
        </div>
    </div>
    <div v-else-if="isBasic" :class="cx('root')" v-bind="ptmi('root')">
        <Message v-for="msg of messages" :key="msg" severity="error" @close="onMessageClose" :unstyled="unstyled" :pt="ptm('pcMessage')">{{ msg }}</Message>
        <div :class="cx('basicContent')" v-bind="ptm('basicContent')">
            <Button
                :label="chooseButtonLabel"
                :class="chooseButtonClass"
                :style="style"
                :disabled="disabled"
                :unstyled="unstyled"
                @mouseup="onBasicUploaderClick"
                @keydown.enter="choose"
                @focus="onFocus"
                @blur="onBlur"
                v-bind="chooseButtonProps"
                :pt="ptm('pcChooseButton')"
            >
                <template #icon="iconProps">
                    <slot name="chooseicon">
                        <component
                            :is="chooseIcon ? 'span' : 'PlusIcon'"
                            :class="[iconProps.class, chooseIcon]"
                            aria-hidden="true"
                            v-bind="ptm('pcChooseButton')['icon']"
                        />
                    </slot>
                </template>
            </Button>
            <slot v-if="!auto" name="filelabel" :class="cx('filelabel')" :files="files">
                <span :class="cx('filelabel')">
                    {{ basicFileChosenLabel }}
                </span>
            </slot>
            <input
                :id="inputId"
                ref="fileInput"
                type="file"
                :accept="accept"
                :disabled="disabled"
                :multiple="multiple"
                @change="onFileSelect"
                @focus="onFocus"
                @blur="onBlur"
                v-bind="ptm('input')"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { addClass, removeClass } from '../internal/utils/dom/index';
import { PlusIcon, TimesIcon, UploadIcon } from '../internal/lucide';
import Button from '../button/Button.vue';
import Message from '../message/Message.vue';
import ProgressBar from '../progressbar/ProgressBar.vue';
import Ripple from '../ripple/Ripple';
import { defineComponent } from 'vue';
import BaseFileUpload from './BaseFileUpload.vue';
import FileContent from './FileContent.vue';

type SelectedFile = File & { objectURL?: string };

function getSelectedFiles(event: Event): FileList | null | undefined {
    return (event as DragEvent).dataTransfer?.files ?? (event.target as HTMLInputElement | null)?.files;
}

export default defineComponent({
    name: 'FileUpload',
    extends: BaseFileUpload,
    inheritAttrs: false,
    emits: ['select', 'uploader', 'before-upload', 'progress', 'upload', 'error', 'before-send', 'clear', 'remove', 'remove-uploaded-file'],
    data() {
        return {
            duplicateIEEvent: false,
            uploadedFileCount: 0,
            files: [] as SelectedFile[],
            messages: [] as string[] | null,
            focused: false,
            progress: null as number | null,
            uploadedFiles: [] as SelectedFile[]
        };
    },
    methods: {
        upload() {
            if (this.hasFiles) this.uploader();
        },
        onBasicUploaderClick(event: MouseEvent) {
            if (event.button === 0) this.choose();
        },
        onFileSelect(event: Event) {
            if (event.type !== 'drop' && this.isIE11() && this.duplicateIEEvent) {
                this.duplicateIEEvent = false;

                return;
            }

            if (this.isBasic && this.hasFiles) {
                this.files = [];
            }

            this.messages = [];
            this.files = this.files || [];
            const files = getSelectedFiles(event);
            let rejectedByLimit = false;

            for (const file of (files ?? []) as Iterable<SelectedFile>) {
                if (this.isFileSelected(file)) continue;

                if (this.fileLimit && this.files.length + this.uploadedFileCount >= this.fileLimit) {
                    rejectedByLimit = true;
                    break;
                }

                if (this.validate(file)) {
                    if (this.isImage(file)) {
                        file.objectURL = window.URL.createObjectURL(file);
                    }

                    this.files.push(file);
                }
            }

            this.$emit('select', { originalEvent: event, files: this.files });

            if (this.fileLimit) {
                this.checkFileLimit(rejectedByLimit);
            }

            if (this.auto && this.hasFiles && !this.isFileLimitExceeded()) {
                this.uploader();
            }

            if (event.type !== 'drop' && this.isIE11()) {
                this.clearIEInput();
            } else {
                this.clearInputElement();
            }
        },
        choose() {
            (this.$refs.fileInput as HTMLInputElement | undefined)?.click();
        },
        uploader() {
            if (this.customUpload) {
                if (this.fileLimit) {
                    this.uploadedFileCount += this.files.length;
                }

                this.$emit('uploader', { files: this.files });
            } else {
                let xhr = new XMLHttpRequest();
                let formData = new FormData();

                this.$emit('before-upload', {
                    xhr: xhr,
                    formData: formData
                });

                for (let file of this.files) {
                    formData.append(this.name, file, file.name);
                }

                xhr.upload.addEventListener('progress', (event) => {
                    if (event.lengthComputable) {
                        this.progress = Math.round((event.loaded * 100) / event.total);
                    }

                    this.$emit('progress', {
                        originalEvent: event,
                        progress: this.progress
                    });
                });

                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4) {
                        this.progress = 0;

                        if (xhr.status >= 200 && xhr.status < 300) {
                            if (this.fileLimit) {
                                this.uploadedFileCount += this.files.length;
                            }

                            this.$emit('upload', {
                                xhr: xhr,
                                files: this.files
                            });
                            this.uploadedFiles.push(...this.files);
                        } else {
                            this.$emit('error', {
                                xhr: xhr,
                                files: this.files
                            });
                        }

                        this.clear();
                    }
                };

                if (this.url) {
                    xhr.open('POST', this.url, true);

                    this.$emit('before-send', {
                        xhr: xhr,
                        formData: formData
                    });

                    xhr.withCredentials = this.withCredentials;

                    xhr.send(formData);
                }
            }
        },
        clear() {
            this.files = [];
            this.messages = null;
            this.$emit('clear');

            if (this.isAdvanced) {
                this.clearInputElement();
            }
        },
        onFocus() {
            this.focused = true;
        },
        onBlur() {
            this.focused = false;
        },
        isFileSelected(file: File) {
            if (this.files && this.files.length) {
                for (let sFile of this.files) {
                    if (sFile.name + sFile.type + sFile.size === file.name + file.type + file.size) return true;
                }
            }

            return false;
        },
        isIE11() {
            return (
                !!(window as Window & { MSInputMethodContext?: unknown }).MSInputMethodContext &&
                !!(document as Document & { documentMode?: number }).documentMode
            );
        },
        validate(file: File) {
            if (this.accept && !this.isFileTypeValid(file)) {
                this.messages?.push(this.invalidFileTypeMessage.replace('{0}', file.name).replace('{1}', this.accept));

                return false;
            }

            if (this.maxFileSize && file.size > this.maxFileSize) {
                this.messages?.push(this.invalidFileSizeMessage.replace('{0}', file.name).replace('{1}', this.formatSize(this.maxFileSize)));

                return false;
            }

            return true;
        },
        isFileTypeValid(file: File) {
            let acceptableTypes = this.accept.split(',').map((type) => type.trim());

            for (let type of acceptableTypes) {
                let acceptable = this.isWildcard(type)
                    ? this.getTypeClass(file.type) === this.getTypeClass(type)
                    : file.type == type || this.getFileExtension(file).toLowerCase() === type.toLowerCase();

                if (acceptable) {
                    return true;
                }
            }

            return false;
        },
        getTypeClass(fileType: string) {
            return fileType.substring(0, fileType.indexOf('/'));
        },
        isWildcard(fileType: string) {
            return fileType.indexOf('*') !== -1;
        },
        getFileExtension(file: File) {
            return '.' + file.name.split('.').pop();
        },
        isImage(file: File) {
            return /^image\//.test(file.type);
        },
        onDragEnter(event: DragEvent) {
            if (!this.disabled && (!this.hasFiles || this.multiple)) {
                event.stopPropagation();
                event.preventDefault();
            }
        },
        onDragOver(event: DragEvent) {
            if (!this.disabled && (!this.hasFiles || this.multiple)) {
                const content = this.$refs.content as HTMLElement | undefined;

                if (content) {
                    if (!this.isUnstyled) addClass(content, 'rs-fileupload-highlight');
                    content.setAttribute('data-p-highlight', 'true');
                }
                event.stopPropagation();
                event.preventDefault();
            }
        },
        onDragLeave() {
            if (!this.disabled) {
                const content = this.$refs.content as HTMLElement | undefined;

                if (content) {
                    if (!this.isUnstyled) removeClass(content, 'rs-fileupload-highlight');
                    content.setAttribute('data-p-highlight', 'false');
                }
            }
        },
        onDrop(event: DragEvent) {
            if (!this.disabled) {
                const content = this.$refs.content as HTMLElement | undefined;

                if (content) {
                    if (!this.isUnstyled) removeClass(content, 'rs-fileupload-highlight');
                    content.setAttribute('data-p-highlight', 'false');
                }
                event.stopPropagation();
                event.preventDefault();

                const files = getSelectedFiles(event);
                const allowDrop = this.multiple || (files && files.length === 1);

                if (allowDrop) {
                    this.onFileSelect(event);
                }
            }
        },
        remove(index: number) {
            this.clearInputElement();
            let removedFile = this.files.splice(index, 1)[0];

            this.files = [...this.files];
            this.$emit('remove', {
                file: removedFile,
                files: this.files
            });
        },
        removeUploadedFile(index: number) {
            let removedFile = this.uploadedFiles.splice(index, 1)[0];

            this.uploadedFiles = [...this.uploadedFiles];
            this.$emit('remove-uploaded-file', {
                file: removedFile,
                files: this.uploadedFiles
            });
        },
        clearInputElement() {
            const input = this.$refs.fileInput as HTMLInputElement | undefined;
            if (input) input.value = '';
        },
        clearIEInput() {
            if (this.$refs.fileInput) {
                this.duplicateIEEvent = true;
                this.clearInputElement();
            }
        },
        formatSize(bytes: number) {
            const k = 1024;
            const dm = 3;
            const sizes = this.$primevue.config.locale?.fileSizeTypes || ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

            if (bytes === 0) {
                return `0 ${sizes[0]}`;
            }

            const i = Math.floor(Math.log(bytes) / Math.log(k));
            const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

            return `${formattedSize} ${sizes[i]}`;
        },
        isFileLimitExceeded() {
            if (this.fileLimit && this.fileLimit <= this.files.length + this.uploadedFileCount && this.focused) {
                this.focused = false;
            }

            return this.fileLimit && this.fileLimit < this.files.length + this.uploadedFileCount;
        },
        checkFileLimit(rejectedByLimit = false) {
            if (this.isFileLimitExceeded() || rejectedByLimit) {
                this.messages?.push(this.invalidFileLimitMessage.replace('{0}', String(this.fileLimit)));
            }
        },
        onMessageClose() {
            this.messages = null;
        }
    },
    computed: {
        isAdvanced() {
            return this.mode === 'advanced';
        },
        isBasic() {
            return this.mode === 'basic';
        },
        chooseButtonClass() {
            return [this.cx('pcChooseButton'), this.class];
        },
        basicFileChosenLabel() {
            if (this.auto) return this.chooseButtonLabel;
            else if (this.hasFiles) {
                if (this.files && this.files.length === 1) return this.files[0].name;

                return this.$primevue.config.locale?.fileChosenMessage?.replace('{0}', String(this.files.length));
            }

            return this.$primevue.config.locale?.noFileChosenMessage || '';
        },
        hasFiles() {
            return this.files && this.files.length > 0;
        },
        hasUploadedFiles() {
            return this.uploadedFiles && this.uploadedFiles.length > 0;
        },
        chooseDisabled() {
            return this.disabled || (!!this.fileLimit && this.fileLimit <= this.files.length + this.uploadedFileCount);
        },
        uploadDisabled() {
            return this.disabled || !this.hasFiles || (!!this.fileLimit && this.fileLimit < this.files.length);
        },
        cancelDisabled() {
            return this.disabled || !this.hasFiles;
        },
        chooseButtonLabel() {
            return this.chooseLabel || this.$primevue.config.locale?.choose;
        },
        uploadButtonLabel() {
            return this.uploadLabel || this.$primevue.config.locale?.upload;
        },
        cancelButtonLabel() {
            return this.cancelLabel || this.$primevue.config.locale?.cancel;
        },
        completedLabel() {
            return this.$primevue.config.locale?.completed;
        },
        pendingLabel() {
            return this.$primevue.config.locale?.pending;
        }
    },
    components: {
        Button,
        ProgressBar,
        Message,
        FileContent,
        PlusIcon,
        UploadIcon,
        TimesIcon
    },
    directives: {
        ripple: Ripple
    }
});
</script>
