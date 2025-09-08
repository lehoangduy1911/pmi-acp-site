#!/usr/bin/env node
// Stage & commit (optional --empty). Không push.
const { execSync } = require('child_process');
const readline = require('readline');

const sh = (cmd, opts = {}) => execSync(cmd, { stdio: 'inherit', ...opts });
const out = (cmd) => execSync(cmd).toString().trim();

const prompt = (q) => new Promise((res) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(q, (ans) => { rl.close(); res(ans); });
});

(async () => {
    const args = process.argv.slice(2);
    const forceEmpty = args.includes('--empty');
    const msgArg = args.find(a => a !== '--empty');
    let msg = (msgArg || '').trim();
    if (!msg) msg = await prompt('Commit message: ');

    // Stage all
    sh('git add -A');

    // Check if there are changes
    const changed = out('git status --porcelain');
    if (!changed && !forceEmpty) {
        console.log('ℹ️  Nothing to commit.');
        process.exit(0);
    }

    const safeMsg = msg.replace(/"/g, '\\"');
    const emptyFlag = (!changed && forceEmpty) ? '--allow-empty ' : (forceEmpty ? '--allow-empty ' : '');
    sh(`git commit ${emptyFlag}-m "${safeMsg}"`);
    console.log('✅ Commit done.');
})().catch(err => { console.error(err); process.exit(1); });
