import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

interface Issue {
    number: number;
    url: string;
    title: string;
    component: string;
    disposition: 'fixed' | 'already-fixed' | 'not-reproducible' | 'duplicate' | 'enhancement' | 'out-of-scope' | 'unverified';
    evidence: string[];
    test?: { path: string; name: string };
    resolvingCommit?: string;
    primaryIssue?: number;
    evidenceGap?: string;
}

interface Ledger {
    snapshot: {
        repository: string;
        total: number;
        startedAt: string;
        finishedAt: string;
        forkRevision: string;
        issueNumbersSha256: string;
    };
    issues: Issue[];
}

const root = fileURLToPath(new URL('..', import.meta.url));
const ledgerPath = new URL('../docs/upstream-issues.json', import.meta.url);
const { snapshot, issues } = JSON.parse(readFileSync(ledgerPath, 'utf8')) as Ledger;
assert.equal(snapshot.repository, 'openvi-foundation/openvue');
assert(Date.parse(snapshot.startedAt) <= Date.parse(snapshot.finishedAt), 'Snapshot times are ordered');
assert.match(snapshot.forkRevision, /^[a-f0-9]{40}$/);
assert.equal(issues.length, snapshot.total, 'Ledger reconciles with the snapshot count');
const ids = new Set(issues.map(({ number }) => number));
assert.equal(ids.size, issues.length, 'Each upstream issue appears once');
const digest = createHash('sha256')
    .update(
        [...ids]
            .sort((a, b) => a - b)
            .map((id) => `${id}\n`)
            .join('')
    )
    .digest('hex');
assert.equal(digest, snapshot.issueNumbersSha256, 'The complete issue ID set matches the snapshot');

const byNumber = new Map(issues.map((issue) => [issue.number, issue]));
const dispositions = new Set(['fixed', 'already-fixed', 'not-reproducible', 'duplicate', 'enhancement', 'out-of-scope', 'unverified']);
const summary = new Map<string, number>();

for (const issue of issues) {
    const label = `#${issue.number}`;
    assert.equal(issue.url, `https://github.com/${snapshot.repository}/issues/${issue.number}`);
    assert(issue.title.trim() && issue.component.trim(), `${label} has a title and component`);
    assert(dispositions.has(issue.disposition), `${label} has a recognized disposition`);

    if (issue.disposition === 'unverified') {
        assert(issue.evidenceGap?.trim(), `${label} identifies the specific evidence gap`);
    } else {
        assert(
            issue.evidence?.some((entry) => entry.trim()),
            `${label} supplies decision evidence`
        );
    }

    if (issue.disposition === 'duplicate') {
        const primary = byNumber.get(issue.primaryIssue ?? -1);
        assert(primary && primary !== issue && primary.disposition !== 'duplicate', `${label} points to a primary issue`);
    }

    if (issue.disposition === 'fixed' || issue.disposition === 'already-fixed') {
        assert(issue.test?.path && issue.test?.name, `${label} has a named local regression test`);
        assert(existsSync(new URL(`../${issue.test.path}`, import.meta.url)), `${label} regression file exists`);
        assert(issue.resolvingCommit && /^[a-f0-9]{40}$/.test(issue.resolvingCommit), `${label} records a full resolving commit`);
        const commit = spawnSync('git', ['cat-file', '-e', `${issue.resolvingCommit}^{commit}`], { cwd: root });
        assert.equal(commit.status, 0, `${label} resolving commit is in the repository`);
    }

    summary.set(issue.disposition, (summary.get(issue.disposition) ?? 0) + 1);
}

console.log(`Verified all ${issues.length} snapshot issue IDs`);
for (const [status, count] of [...summary].sort()) console.log(`${status} ${count}`);
