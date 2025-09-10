// Query helpers
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

// Pure utils
export function shuffleArray(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
export function escapeHtml(s = '') {
    return String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}
export function fmtHMS(sec) {
    const hh = String(Math.floor(sec / 3600)).padStart(2, '0');
    const mm = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
    const ss = String(sec % 60).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
}
export function debounce(fn, wait = 300) {
    let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
}
export function timeStamp() {
    const d = new Date(); const p = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}`;
}
export function csvEscape(v) {
    const s = String(v ?? '');
    if (/[",\n]/.test(s)) return `"${s.replaceAll('"', '""')}"`;
    return s;
}

// Pending + ripple support
export function setPending(el, on = true) {
    if (!el) return;
    if (on) { el.setAttribute('aria-busy', 'true'); el.classList.add('is-pending'); }
    else { el.removeAttribute('aria-busy'); el.classList.remove('is-pending'); }
}
export function hold(el, work) {
    setPending(el, true);
    try {
        const r = work?.();
        if (r && typeof r.then === 'function') r.finally(() => setPending(el, false));
        else requestAnimationFrame(() => setTimeout(() => setPending(el, false), 180));
    } catch (err) { setPending(el, false); throw err; }
}

/* ================= UI helpers ================= */

// --- Rút gọn domain/topic để hiển thị gọn trên chip ---
const TOPIC_SHORT_MAP = {
    'Agile Principles and Mindset': 'Agile Mindset',
    'Value-driven Delivery': 'Value Delivery',
    'Stakeholder Engagement': 'Stakeholders',
    'Team Performance': 'Team',
    'Adaptive Planning': 'Planning',
    'Problem Detection and Resolution': 'Problem & Resolution',
    'Continuous Improvement (Product, Process, People)': 'Continuous Improvement',
};
export function shortTopic(name = 'Topic') {
    let t = String(name || '').trim();
    // Ưu tiên map; nếu không có thì lược bỏ phần trong ngoặc
    t = TOPIC_SHORT_MAP[t] || t.replace(/\s*\(.*?\)\s*/g, '').trim();
    // Cắt ngắn nếu quá dài
    if (t.length > 26) t = t.slice(0, 24) + '…';
    return t || 'Topic';
}

// --- Chuẩn hoá và gán màu heat-map cho độ khó ---
function normalizeDiff(d) {
    const s = String(d || '').trim().toLowerCase();
    if (['very hard', 'very-hard', 'vhard', 'hardest', 'expert'].includes(s)) return 'very-hard';
    if (['hard', 'h'].includes(s)) return 'hard';
    if (['medium', 'med', 'm'].includes(s)) return 'medium';
    if (['easy', 'e'].includes(s)) return 'easy';
    return 'unknown';
}
export function diffClass(d) {
    switch (normalizeDiff(d)) {
        case 'easy': return 'chip chip-emerald'; // xanh lá
        case 'medium': return 'chip chip-amber';   // vàng
        case 'hard': return 'chip chip-orange';  // cam
        case 'very-hard': return 'chip chip-rose';    // đỏ
        default: return 'chip chip-gray';
    }
}

// Toast nhỏ
export function toast(text = 'Đã lưu') {
    const el = document.createElement('div');
    el.className = 'fixed left-1/2 -translate-x-1/2 bottom-6 z-50 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm shadow';
    el.textContent = text;
    document.body.append(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .4s'; setTimeout(() => el.remove(), 400); }, 1200);
}
