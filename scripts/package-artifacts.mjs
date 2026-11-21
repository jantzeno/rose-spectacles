import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const packagesDir = fileURLToPath(new URL('../packages/', import.meta.url));
const { workspaces } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

// Dependencies must be published before their dependents.
export const publishable = {
    '@openvue/metadata': 'metadata',
    '@openvue/auto-import-resolver': 'auto-import-resolver',
    '@openvue/core': 'core',
    '@openvue/icons': 'icons',
    openvue: 'primevue',
    '@openvue/forms': 'forms',
    '@openvue/themes': 'themes',
    '@openvue/nuxt-module': 'nuxt-module',
    '@openvue/mcp': 'mcp',
    '@openvue/migrate': 'migrate',
    'openvolt-vue': 'volt-cli'
};

function readManifest(dir) {
    return JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
}

function pack(directory, destination) {
    return execFileSync('bun', ['pm', 'pack', '--ignore-scripts', '--quiet', '--destination', destination], {
        cwd: directory,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'inherit']
    }).trim();
}

export function packPackage(name, destination) {
    const directory = join(packagesDir, publishable[name]);
    const sourceManifest = readManifest(directory);
    const { directory: output, ...publishConfig } = sourceManifest.publishConfig;
    const entryPoints = ['main', 'module', 'types', 'exports'].filter((field) => Object.hasOwn(publishConfig, field));

    if (!output && entryPoints.length === 0) return pack(directory, destination);

    // Bun packs the current folder and keeps publishConfig entry points as metadata.
    const staging = mkdtempSync(join(tmpdir(), 'openvue-pack-'));

    try {
        const builtDir = output ? join(directory, output) : directory;
        const manifest = output ? readManifest(builtDir) : sourceManifest;

        if (output) {
            cpSync(builtDir, staging, { recursive: true });
        } else {
            for (const path of [...manifest.files, 'README.md', 'LICENSE.md', 'LICENSE']) {
                const source = join(directory, path);

                if (existsSync(source)) cpSync(source, join(staging, path), { recursive: true });
            }
        }

        for (const field of entryPoints) manifest[field] = publishConfig[field];

        for (const section of ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies']) {
            for (const [dependency, specifier] of Object.entries(manifest[section] ?? {})) {
                if (specifier === 'workspace:*') {
                    manifest[section][dependency] = readManifest(join(packagesDir, publishable[dependency])).version;
                } else if (specifier.startsWith('catalog:')) {
                    const catalog = specifier.slice('catalog:'.length);

                    manifest[section][dependency] = (catalog ? workspaces.catalogs[catalog] : workspaces.catalog)[dependency];
                }
            }
        }

        writeFileSync(join(staging, 'package.json'), `${JSON.stringify(manifest, null, 4)}\n`);

        return pack(staging, destination);
    } finally {
        rmSync(staging, { recursive: true, force: true });
    }
}
