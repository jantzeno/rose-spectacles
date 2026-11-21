# Rose Spectacles

Rose Spectacles brings Vue 3 components, forms, icons, directives, and services together in one source package. It includes structural styles and exposes `rs-` classes and CSS custom properties for your application styles.

## Install

Pin the Git dependency to a reviewed commit. Replace `COMMIT_SHA` with its full SHA.

```sh
bun add 'rose-spectacles@github:jantzeno/rose-spectacles#COMMIT_SHA'
bun add 'vue@^3.5.0'
```

Configure Vite to compile the Vue single-file components and skip prebundling the source package.

```ts
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [vue()],
    optimizeDeps: { exclude: ['rose-spectacles'] },
    ssr: { noExternal: ['rose-spectacles'] }
});
```

Register the configuration plugin and import components by name or by subpath.

```ts
import { createApp } from 'vue';
import RoseSpectacles from 'rose-spectacles/config';
import App from './App.vue';

createApp(App).use(RoseSpectacles).mount('#app');
```

```vue
<script setup lang="ts">
import { Button } from 'rose-spectacles';
import Select from 'rose-spectacles/select';
</script>
```

Install the optional peer before importing Chart from `rose-spectacles/chart` or Editor from `rose-spectacles/editor`. Import forms and icons by name from the package root or from their dedicated subpaths such as `rose-spectacles/forms/form` and `rose-spectacles/icons/check`. Schema resolvers use `rose-spectacles/forms/resolvers/<library>` with the corresponding validator installed.

## Attribution

The source incorporates MIT-licensed work from PrimeTek, OpenVi Foundation, and contributors. See the [license](LICENSE.md).
