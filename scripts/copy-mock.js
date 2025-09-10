// scripts/copy-mock.js
/**
 * Copy toàn bộ static/mock → build/mock
 * Nếu site đa ngôn ngữ có thư mục build/en → copy thêm build/en/mock
 * Chạy được trên mọi OS (Node >= 18)
 */
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC = path.resolve(__dirname, '..', 'static', 'mock');
const DEST_MAIN = path.resolve(__dirname, '..', 'build', 'mock');
const DEST_EN = path.resolve(__dirname, '..', 'build', 'en', 'mock');

function exists(p) { try { fs.accessSync(p); return true; } catch { return false; } }

async function copyDir(src, dest) {
    if (!exists(src)) {
        console.log('⚠️  static/mock không tồn tại, bỏ qua copy');
        return;
    }
    await fsp.mkdir(dest, { recursive: true });
    const entries = await fsp.readdir(src, { withFileTypes: true });
    await Promise.all(entries.map(async (ent) => {
        const s = path.join(src, ent.name);
        const d = path.join(dest, ent.name);
        if (ent.isDirectory()) await copyDir(s, d);
        else await fsp.copyFile(s, d);
    }));
}

(async () => {
    console.log('↪ Copy static/mock → build/mock');
    await copyDir(SRC, DEST_MAIN);

    if (exists(path.resolve(__dirname, '..', 'build', 'en'))) {
        console.log('↪ Copy static/mock → build/en/mock');
        await copyDir(SRC, DEST_EN);
    }

    console.log('✅ Copy mock assets done');
})().catch((e) => {
    console.error('❌ Copy mock assets failed:', e);
    process.exit(1);
});
