/* /static/js/analytics.js */

// ===== Cache UTM 1st-touch =====
(function () {
    try {
        const p = new URLSearchParams(location.search);
        const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
        const utm = {}; keys.forEach(k => p.get(k) && (utm[k] = p.get(k)));
        if (Object.keys(utm).length) localStorage.setItem('utm_cached', JSON.stringify(utm));
    } catch (_) { }
})();

function allowed() {
    const dnt = navigator.doNotTrack === '1' || window.doNotTrack === '1';
    const consent = localStorage.getItem('analytics_consent'); // 'granted'|'denied'|null
    if (dnt || consent === 'denied') return false;
    return true;
}

function trackEvent(name, props = {}) {
    if (!allowed()) return;
    try {
        const utm = JSON.parse(localStorage.getItem('utm_cached') || '{}');
        props = { ...utm, ...props };
    } catch (_) { }
    if (typeof window.plausible === 'function') {
        // Plausible custom events + props
        window.plausible(name, { props }); // ví dụ: plausible('CTA.Home.Hero.Click', {props:{label:'Start Here', ...}})
    }
}

function trackCTA({ page, placement, action = 'Click', label, dest, variant, component_id, extra } = {}) {
    const name = `CTA.${page}.${placement}.${action}`;
    trackEvent(name, { label, dest, variant, component_id, ...extra });
}

// ---------- Autowire CTA cho site của bạn ----------
function autowireCTAs() {
    const MAP = [
        // Home hero
        { sel: 'a[href="/start-here"]', meta: { page: 'Home', placement: 'Hero', label: 'Start Here' } },
        { sel: 'a[href="/docs/pmi-acp/plan/week-1"]', meta: { page: 'Home', placement: 'Hero', label: 'Kế hoạch học' } },

        // Các CTA text phổ biến trên Home
        { contains: 'Xem Tuần 1', meta: { page: 'Home', placement: 'WhySection', label: 'Xem Tuần 1' } },
        { contains: 'Vào học ngay', meta: { page: 'Home', placement: 'WhySection', label: 'Vào học ngay' } },
        { contains: 'Bắt đầu checklist', meta: { page: 'Home', placement: 'WhySection', label: 'Bắt đầu checklist' } },
        { contains: 'Cách dùng song ngữ', meta: { page: 'Home', placement: 'WhySection', label: 'Cách dùng song ngữ' } },

        // “Học theo 4 bước”
        { contains: 'Start here', meta: { page: 'Home', placement: '4Steps', label: 'Start here' } },
        { contains: 'Lesson 01', meta: { page: 'Home', placement: '4Steps', label: 'Lesson 01' } },
        { contains: 'Tuần 3', meta: { page: 'Home', placement: '4Steps', label: 'Tuần 3' } },
        { contains: 'Week 6', meta: { page: 'Home', placement: '4Steps', label: 'Week 6' } },

        // Navbar (toàn site)
        { sel: 'a[href="/start-here"]', meta: { page: 'GlobalNav', placement: 'Navbar', label: 'Start Here' } },
        { sel: 'a[href="/docs/pmi-acp/plan/week-1"]', meta: { page: 'GlobalNav', placement: 'Navbar', label: 'Kế hoạch học' } },
        { sel: 'a[href="/blog"]', meta: { page: 'GlobalNav', placement: 'Navbar', label: 'Blog' } },
        { sel: 'a[href="/faq"]', meta: { page: 'GlobalNav', placement: 'Navbar', label: 'FAQ' } },
        { sel: 'a[href="/about"]', meta: { page: 'GlobalNav', placement: 'Navbar', label: 'About' } },
        { sel: 'a[href="/contact"]', meta: { page: 'GlobalNav', placement: 'Navbar', label: 'Contact' } },
        { contains: 'Tiếng Việt', meta: { page: 'GlobalNav', placement: 'LangToggle', label: 'Language' } },
        { contains: 'English', meta: { page: 'GlobalNav', placement: 'LangToggle', label: 'Language' } },

        // Week pages – checklist/subscribe (tùy trang)
        { contains: 'Đánh dấu hoàn thành', meta: { page: 'Week', placement: 'Checklist', label: 'MarkComplete' } },
    ];

    function mark(el, meta) {
        if (!el || el.dataset.cta) return;
        el.dataset.cta = '1';
        el.dataset.page = meta.page;
        el.dataset.placement = meta.placement;
        el.dataset.label = meta.label;
    }

    // theo selector tường minh
    MAP.filter(m => m.sel).forEach(m => {
        document.querySelectorAll(m.sel).forEach(el => mark(el, m.meta));
    });

    // theo text (fallback)
    const textTargets = Array.from(document.querySelectorAll('a,button'));
    MAP.filter(m => m.contains).forEach(m => {
        textTargets
            .filter(el => (el.textContent || '').trim().includes(m.contains))
            .forEach(el => mark(el, m.meta));
    });
}

function bindCTAHandlers() {
    // Click
    document.addEventListener('click', e => {
        const el = e.target.closest('[data-cta]');
        if (!el) return;
        trackCTA({
            page: el.dataset.page,
            placement: el.dataset.placement,
            action: 'Click',
            label: el.dataset.label,
            dest: el.getAttribute('href') || location.pathname,
        });
    });

    // Impression (1 lần/phiên/CTA)
    const seen = new Set();
    const io = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const id = [el.dataset.page, el.dataset.placement, el.dataset.label].join('|');
                if (seen.has(id)) return;
                seen.add(id);
                trackCTA({
                    page: el.dataset.page,
                    placement: el.dataset.placement,
                    action: 'Impression',
                    label: el.dataset.label,
                    dest: el.getAttribute('href') || location.pathname,
                });
                io.unobserve(el);
            });
        },
        { threshold: 0.3 }
    );

    document.querySelectorAll('[data-cta]').forEach(el => io.observe(el));
}

// Subscribe form generic (Submit/Success)
function wireSubscribe() {
    const form = document.querySelector('form');
    if (!form) return;
    const btn = form.querySelector('button, input[type="submit"]');
    if (!btn) return;

    btn.addEventListener('click', () =>
        trackCTA({ page: 'Week', placement: 'Subscribe', action: 'Submit', label: btn.textContent?.trim() || 'Subscribe' })
    );

    // Quan sát thay đổi DOM để suy ra Success (tùy widget)
    const mo = new MutationObserver(() => {
        const ok = /đăng ký|cảm ơn|thank/i.test(document.body.innerText);
        if (ok) {
            trackCTA({ page: 'Week', placement: 'Subscribe', action: 'Success', label: 'Subscribe' });
            mo.disconnect();
        }
    });
    mo.observe(document.body, { childList: true, subtree: true });
}

document.addEventListener('DOMContentLoaded', () => {
    autowireCTAs();
    bindCTAHandlers();
    wireSubscribe();
});

// Expose để dùng thủ công nếu cần
window.__analytics = { trackEvent, trackCTA };
