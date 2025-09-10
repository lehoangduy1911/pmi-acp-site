// scripts/release-mock-assets.js
// Dùng: node scripts/release-mock-assets.js 2025-09-10-4
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const VER = process.argv[2];
if (!VER) {
    console.error('Usage: node scripts/release-mock-assets.js <version>');
    process.exit(1);
}

const ROOT = process.cwd();
const mockDir = path.join(ROOT, 'static', 'mock');
const srcAssets = path.join(mockDir, 'assets');
const dstAssets = path.join(mockDir, `assets-${VER}`);
const indexHtml = path.join(mockDir, 'index.html');

function exists(p) { try { fs.accessSync(p); return true; } catch { return false; } }

async function copyDir(src, dest) {
    await fsp.mkdir(dest, { recursive: true });
    const entries = await fsp.readdir(src, { withFileTypes: true });
    await Promise.all(entries.map(async (ent) => {
        const s = path.join(src, ent.name);
        const d = path.join(dest, ent.name);
        if (ent.isDirectory()) return copyDir(s, d);
        return fsp.copyFile(s, d);
    }));
}

(async () => {
    if (!exists(srcAssets)) {
        console.error('✖ Không tìm thấy', path.relative(ROOT, srcAssets));
        process.exit(1);
    }
    if (!exists(indexHtml)) {
        console.error('✖ Không tìm thấy', path.relative(ROOT, indexHtml));
        process.exit(1);
    }

    // 1) Copy toàn bộ assets → assets-VER
    console.log(`↪ Copy ${path.relative(ROOT, srcAssets)} → ${path.relative(ROOT, dstAssets)}`);
    await copyDir(srcAssets, dstAssets);

    // 2) Sửa index.html: trỏ tới thư mục mới, thêm biến version
    let html = await fsp.readFile(indexHtml, 'utf8');

    // Đảm bảo có base
    if (!/<base\s+href="\/mock\/"/i.test(html)) {
        html = html.replace(/<head>/i, '<head>\n  <base href="/mock/">');
    }

    // Chèn/ghi đè biến version
    if (!/__MOCK_ASSET_VERSION__/.test(html)) {
        html = html.replace(
            /<\/head>/i,
            `  <script>window.__MOCK_ASSET_VERSION__='${VER}';window.__MOCK_DATA_VERSION__='${VER}';</script>\n</head>`
        );
    } else {
        html = html.replace(/(__MOCK_ASSET_VERSION__=)['"][^'"]+['"]/, `$1'${VER}'`);
        html = html.replace(/(__MOCK_DATA_VERSION__=)['"][^'"]+['"]/, `$1'${VER}'`);
    }

    // Ghi đè mọi đường dẫn assets/xxx.(js|css) -> assets-VER/xxx...
    // (áp dụng cho rel="modulepreload", <script type="module">, <link rel="stylesheet"> ...)
    const reAssetJs = /(href|src)=["']assets\/([a-z0-9._\-]+\.m?js)(\?v=[^"']*)?["']/gi;
    const reAssetCss = /(href|src)=["']assets\/([a-z0-9._\-]+\.css)(\?v=[^"']*)?["']/gi;

    html = html.replace(reAssetJs, (m, attr, file /*, vq */) =>
        `${attr}="assets-${VER}/${file}"`
    );
    html = html.replace(reAssetCss, (m, attr, file /*, vq */) =>
        `${attr}="assets-${VER}/${file}"`
    );

    await fsp.writeFile(indexHtml, html, 'utf8');
    console.log('✔ Patched', path.relative(ROOT, indexHtml));

    console.log('✅ Release assets by path done. Hãy commit & deploy.');
})().catch((e) => {
    console.error('❌ Release failed:', e);
    process.exit(1);
});

