import React from 'react';

type LinkItem = { href: string; label: string; variant?: 'solid' | 'ghost' };

const links: LinkItem[] = [
    { href: '/docs/pmi-acp/blueprint-2025', label: 'Blueprint 2025', variant: 'solid' },
    { href: '/docs/pmi-acp/domains/domain-mindset', label: 'Mindset' },
    { href: '/docs/pmi-acp/domains/domain-leadership', label: 'Leadership' },
    { href: '/docs/pmi-acp/domains/domain-product', label: 'Product' },
    { href: '/docs/pmi-acp/domains/domain-delivery', label: 'Delivery' },
];

export default function CtaQuickLinks() {
    return (
        <div className="cta-quick" role="region" aria-label="Lối tắt ECO 2024+">
            <span className="cta-quick__title">Lối tắt:</span>
            <nav className="cta-quick__links" aria-label="Blueprint và 4 domain">
                {links.map((l) => (
                    <a
                        key={l.href}
                        className={l.variant === 'solid' ? 'button button--brand' : 'button button--brand-ghost'}
                        href={l.href}
                    >
                        {l.label}
                    </a>
                ))}
            </nav>
            <span className="pill-badge" aria-label="ECO 2024+ bốn domain">ECO 2024+ · 4 domain</span>
        </div>
    );
}
