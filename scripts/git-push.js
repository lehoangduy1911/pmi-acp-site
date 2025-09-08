#!/usr/bin/env node
// Add → Commit (optional --empty) → Push (tự set upstream nếu thiếu)
const { execSync } = require('child_process');
const readline = require('readline');

const sh = (cmd, opts = {}) => execSync(cmd, { stdio: 'inherit', ...opts });
const out = (cmd) => execSync(cmd).toString().trim();
const prompt = (q) => new Promise((res) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(q, (ans) => { rl.close(); res(ans); });
});

const hasUpstream = (b) => {
    try { execSync(`git rev-parse --abbrev-ref ${b}@{upstream}`, { stdio: 'ignore' }); return true; }
    catch { return false; }
};

(async () => {
    const args = process.argv.slice(2);
    const forceEmpty = args.includes('--empty');
    const msgArg = args.find(a => a !== '--empty');
    let msg = (msgArg || '').trim();

    // Stage
    sh('git add -A');

    // Commit (if there are changes, or --empty)
    const changed = out('git status --porcelain');
    if (changed || forceEmpty || !msg) {
        if (!msg) msg = await prompt('Commit message: ');
        const safeMsg = msg.replace(/"/g, '\\"');
        const emptyFlag = (!changed && forceEmpty) ? '--allow-empty ' : (forceEmpty ? '--allow-empty ' : '');
        try { sh(`git commit ${emptyFlag}-m "${safeMsg}"`); }
        catch { console.log('ℹ️  Nothing to commit, will push anyway…'); }
    }

    // Push
    const branch = out('git rev-parse --abbrev-ref HEAD');
    try {
        sh('git push');
    } catch {
        if (!hasUpstream(branch)) {
            console.log(`No upstream for ${branch}, setting origin/${branch}…`);
            sh(`git push -u origin ${branch}`);
        } else {
            throw new Error('Push failed.');
        }
    }
    console.log(`✅ Pushed to origin/${branch}`);
})().catch(err => { console.error(err); process.exit(1); });
