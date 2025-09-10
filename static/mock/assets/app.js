import { renderLanding } from './landing.js?v=2025-09-xx-y';

// Micro-interaction: ripple
document.addEventListener('click', (e) => {
    const btn = e.target.closest('button, a.btn-anim');
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = (e.clientX ?? rect.left + rect.width / 2) - rect.left;
    const y = (e.clientY ?? rect.top + rect.height / 2) - rect.top;
    const dot = document.createElement('span');
    dot.className = 'ripple';
    dot.style.left = x + 'px';
    dot.style.top = y + 'px';
    btn.appendChild(dot);
    setTimeout(() => dot.remove(), 650);
});

// Boot
renderLanding();
