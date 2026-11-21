import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { packPackage, publishable } from './package-artifacts.mjs';

const tag = process.argv[2] ?? 'latest';
const destination = mkdtempSync(join(tmpdir(), 'openvue-release-'));

try {
    const tarballs = Object.keys(publishable).map((name) => packPackage(name, destination));

    for (const tarball of tarballs) {
        execFileSync('bun', ['publish', tarball, '--access', 'public', '--tag', tag, '--tolerate-republish'], { stdio: 'inherit' });
    }
} finally {
    rmSync(destination, { recursive: true, force: true });
}
