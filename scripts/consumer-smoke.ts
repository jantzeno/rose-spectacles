import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import manifest from '../package.json';

const root = fileURLToPath(new URL('..', import.meta.url));
const consumer = await mkdtemp(join(tmpdir(), 'rose-consumer-'));
const tarball = `${manifest.name}-${manifest.version}.tgz`;

function run(args: string[], cwd = consumer) {
    const { status, error } = spawnSync('bun', args, { cwd, stdio: 'inherit' });
    if (error) throw error;
    assert.equal(status, 0, `bun ${args.join(' ')} must succeed`);
}

async function write(name: string, content: string) {
    await writeFile(join(consumer, name), content);
}

const optionalDependencies = { 'chart.js': manifest.devDependencies['chart.js'], quill: manifest.devDependencies.quill };
const baseDependencies = { [manifest.name]: `file:./${tarball}`, vue: manifest.devDependencies.vue };
const tools = ['@vitejs/plugin-vue', 'typescript', 'vite', 'vue-tsc'] as const;

try {
    run(['pm', 'pack', '--quiet', '--destination', consumer], root);
    await write(
        'package.json',
        JSON.stringify({
            private: true,
            type: 'module',
            dependencies: baseDependencies,
            devDependencies: Object.fromEntries(tools.map((name) => [name, manifest.devDependencies[name]]))
        })
    );
    await write(
        'index.html',
        '<!doctype html><html lang="en"><head><title>Vite consumer</title></head><body><div id="app"></div><script type="module" src="/main.ts"></script></body></html>'
    );
    await write(
        'vite.config.ts',
        `
        import vue from '@vitejs/plugin-vue';
        import { defineConfig } from 'vite';
        export default defineConfig({
            plugins: [vue()],
            optimizeDeps: { exclude: ['rose-spectacles'] },
            ssr: { noExternal: ['rose-spectacles'] }
        });
    `
    );
    await write(
        'tsconfig.json',
        JSON.stringify({
            compilerOptions: { target: 'ES2022', module: 'ESNext', moduleResolution: 'Bundler', strict: true, noEmit: true },
            vueCompilerOptions: { strictTemplates: true },
            include: ['main.ts', 'App.vue', 'SlotTypes.vue', 'ModelTypes.vue']
        })
    );
    const slotTypes = `
        <script setup lang="ts">
        import { AutoComplete, Carousel, CascadeSelect, DataView, Galleria, InputChips, Listbox, MultiSelect, OrderList, PickList, Select, SelectButton, Timeline, VirtualScroller } from 'rose-spectacles';

        const entries: { title: string }[] = [{ title: 'First entry' }];
        const groups = [{ title: 'Group', children: entries }];
        </script>
        <template>
            <Carousel :value="entries">
                <template #item="{ data }">
                    {{ data.title }}
                </template>
            </Carousel>
            <Galleria :value="entries">
                <template #item="{ item }">
                    {{ item.title }}
                </template>
            </Galleria>
            <Timeline :value="entries">
                <template #content="{ item }">
                    {{ item.title }}
                </template>
            </Timeline>
            <AutoComplete :suggestions="entries" :option-label="(option) => option.title">
                <template #option="{ option }">{{ option.title }}</template>
            </AutoComplete>
            <CascadeSelect :options="entries" :option-label="(option) => option.title">
                <template #option="{ option }">{{ option.title }}</template>
            </CascadeSelect>
            <DataView :value="entries">
                <template #list="{ items }">{{ items[0].title }}</template>
                <template #grid="{ items }">{{ items[0].title }}</template>
            </DataView>
            <OrderList :model-value="entries">
                <template #option="{ option }">{{ option.title }}</template>
            </OrderList>
            <PickList :model-value="[entries, []]">
                <template #option="{ option }">{{ option.title }}</template>
            </PickList>
            <InputChips :model-value="entries">
                <template #chip="{ value }">{{ value.title }}</template>
            </InputChips>
            <SelectButton :options="entries">
                <template #option="{ option }">{{ option.title }}</template>
            </SelectButton>
            <VirtualScroller :items="entries" :item-size="24">
                <template #item="{ item }">{{ item.title }}</template>
            </VirtualScroller>
            ${['Listbox', 'MultiSelect', 'Select']
                .map(
                    (name) => `
                    <${name} :options="entries" option-value="title" :model-value="${name === 'MultiSelect' ? "['First entry']" : "'First entry'"}">
                        <template #option="{ option }">{{ option.title }}</template>
                        <template #header="{ options }">{{ options[0].title }}</template>
                        <template #footer="{ options }">{{ options[0].title }}</template>
                    </${name}>
                    <${name} :options="groups" option-group-label="title" option-group-children="children">
                        <template #option="{ option }">{{ option.title }}</template>
                        <template #optiongroup="{ option }">{{ option.title }}</template>
                        <template #header="{ options }">
                            {{ 'group' in options[0] ? options[0].optionGroup.title : '' }}
                        </template>
                    </${name}>
                `
                )
                .join('')}
        </template>
    `;
    await write('SlotTypes.vue', slotTypes);
    const menuComponents = ['Breadcrumb', 'ContextMenu', 'MegaMenu', 'Menu', 'Menubar', 'PanelMenu', 'SplitButton', 'Steps', 'TabMenu', 'TieredMenu'];
    await write(
        'ModelTypes.vue',
        `
        <script setup lang="ts">
        import { ${menuComponents.join(', ')}, Form, OrganizationChart, Tree, TreeSelect } from 'rose-spectacles';
        import type DataTable from 'rose-spectacles/datatable';
        import type { FormSubmitEvent } from 'rose-spectacles/forms/form';
        import type { MenuItem } from 'rose-spectacles/menuitem';
        import type { OrganizationChartNode } from 'rose-spectacles/organizationchart';
        import type { TreeNode } from 'rose-spectacles/treenode';

        interface RoutedItem extends MenuItem { route: string }
        interface LabeledTreeNode extends TreeNode { customLabel: string }
        interface Employee extends OrganizationChartNode { department: string }
        interface Credentials { email: string; password: string }

        const menu: RoutedItem[] = [{ label: 'Home', route: '/home' }];
        const nodes: LabeledTreeNode[] = [{ key: 'root', customLabel: 'Reports' }];
        const employee: Employee = { key: 'manager', department: 'Sales' };
        const resolveCredentials = ({ values }: { values: Credentials }) => ({ values, errors: {} });
        const submitCredentials = ({ values }: FormSubmitEvent<Credentials>) => values.email.toUpperCase();
        const inferred = <T,>(value: T, ..._requiresKnownType: 0 extends (1 & T) ? [never] : []) => value;
        const csvText = (table: InstanceType<typeof DataTable>): string => table.generateCSV({ selectionOnly: false }, [{ name: 'Copper' }]);
        </script>
        <template>
            ${menuComponents
                .map(
                    (name) => `<${name} :model="menu">
                <template #item="{ item }">{{ inferred(item.route).toUpperCase() }}</template>
            </${name}>`
                )
                .join('\n')}
            <Tree :value="nodes">
                <template #default="{ node }">{{ inferred(node.customLabel).toUpperCase() }}</template>
            </Tree>
            <TreeSelect :options="nodes">
                <template #option="{ node }">{{ inferred(node.customLabel).toUpperCase() }}</template>
            </TreeSelect>
            <OrganizationChart :value="employee">
                <template #default="{ node }">{{ inferred(node.department).toUpperCase() }}</template>
            </OrganizationChart>
            <Form :resolver="resolveCredentials" @submit="submitCredentials" v-slot="fields">
                {{ inferred(fields.email?.value)?.toUpperCase() }}
            </Form>
        </template>
    `
    );
    await write(
        'main.ts',
        `
        import { createApp } from 'vue';
        import RoseSpectacles from 'rose-spectacles/config';
        import ToastService from 'rose-spectacles/toastservice';
        import App from './App.vue';
        createApp(App).use(RoseSpectacles).use(ToastService).mount('#app');
    `
    );
    await write(
        'App.vue',
        `
        <script setup lang="ts">
        import { useTemplateRef } from 'vue';
        import { Button, Form, CheckIcon, Toast, useToast } from 'rose-spectacles';
        import Select from 'rose-spectacles/select';
        import ToastEventBus from 'rose-spectacles/toasteventbus';
        import OverlayEventBus from 'rose-spectacles/overlayeventbus';
        import ConfirmationEventBus from 'rose-spectacles/confirmationeventbus';
        import DynamicDialogEventBus from 'rose-spectacles/dynamicdialogeventbus';

        const form = useTemplateRef<InstanceType<typeof Form>>('form');
        const toast = useToast();
        async function validateThroughTheFormRef() {
            await form.value?.validate();
        }
        function showProgress() {
            toast.add({ severity: 'waiting', summary: 'Uploading', progress: 25 });
        }

        const eventBuses = [ToastEventBus, OverlayEventBus, ConfirmationEventBus, DynamicDialogEventBus];
        for (const bus of eventBuses) {
            const handler = () => {};
            bus.on('consumer-check', handler);
            bus.emit('consumer-check');
            bus.off('consumer-check', handler);
        }
        </script>
        <template>
            <Form ref="form">
                <CheckIcon label="Included" />
                <Select :options="['draft', 'ready']" />
                <Button label="Create" type="button" @click="validateThroughTheFormRef" />
                <Button label="Show progress" type="button" @click="showProgress" />
                <Toast>
                    <template #message="{ message }">
                        <output v-if="typeof message.progress === 'number'">{{ message.progress }}%</output>
                    </template>
                </Toast>
            </Form>
        </template>
    `
    );

    run(['install', '--omit', 'peer']);
    for (const name of Object.keys(optionalDependencies)) {
        assert.equal(existsSync(join(consumer, 'node_modules', name)), false, `${name} is absent in the base consumer`);
    }
    run(['x', '--no-install', 'vue-tsc', '--noEmit']);
    console.log('Menu and tree slots preserve the declared types of extended models');
    console.log('Form infers the submit event and field slot types from its resolver');
    console.log('A packed DataTable instance returns CSV text from generateCSV');

    await write('SlotTypes.vue', slotTypes.replaceAll('.title', '.missingField'));
    const invalidSlots = spawnSync('bun', ['x', '--no-install', 'vue-tsc', '--noEmit'], { cwd: consumer, encoding: 'utf8' });
    if (invalidSlots.error) throw invalidSlots.error;
    const diagnostics = invalidSlots.stdout + invalidSlots.stderr;
    assert.equal(invalidSlots.status, 2, diagnostics);
    const slotErrors = diagnostics.match(/SlotTypes\.vue\(\d+,\d+\): error TS2339: Property 'missingField' does not exist on type/g);
    assert.equal(slotErrors?.length, 32, diagnostics);
    assert.equal(diagnostics.match(/error TS\d+:/g)?.length, 32, diagnostics);
    console.log('Carousel, Galleria, and Timeline slots reject unknown item properties');
    console.log('AutoComplete, CascadeSelect, and DataView reject unknown option and item properties');
    console.log('OrderList and PickList slots reject unknown properties on model items');
    console.log('InputChips, SelectButton, and VirtualScroller slots reject unknown properties on their items');
    console.log('Listbox, MultiSelect, and Select reject unknown properties on flat options, groups, and their children');

    run(['x', '--no-install', 'vite', 'build']);

    await write('SlotTypes.vue', slotTypes);
    run(['add', '--exact', ...Object.entries(optionalDependencies).map(([name, version]) => `${name}@${version}`)]);
    await write(
        'App.vue',
        `
        <script setup lang="ts">
        import { ref } from 'vue';
        import Chart from 'rose-spectacles/chart';
        import Editor from 'rose-spectacles/editor';

        const chartData = { labels: ['March'], datasets: [{ label: 'Orders', data: [4] }] };
        const notes = ref('<p>Field notes</p>');
        </script>
        <template>
            <Chart type="bar" :data="chartData" />
            <Editor v-model="notes" />
        </template>
    `
    );
    run(['x', '--no-install', 'vue-tsc', '--noEmit']);
    run(['x', '--no-install', 'vite', 'build']);
    console.log('Dedicated Chart and Editor imports typecheck and build with their pinned optional peers');
} finally {
    await rm(consumer, { recursive: true, force: true });
}
