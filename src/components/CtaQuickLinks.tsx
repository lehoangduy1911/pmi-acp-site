import React from 'react';
import Link from '@docusaurus/Link';

type LinkItem = { to: string; label: string; variant?: 'solid' | 'ghost' };

const links: LinkItem[] = [
    { to: '/docs/pmi-acp/blueprint-2025', label: 'Blueprint 2025', variant: 'solid' },
    { to: '/docs/pmi-acp/domains/mindset', label: 'Mindset' },
    { to: '/docs/pmi-acp/domains/leadership', label: 'Leadership' },
    { to: '/docs/pmi-acp/domains/product', label: 'Product' },
    { to: '/docs/pmi-acp/domains/delivery', label: 'Delivery' },
];

export default function CtaQuickLinks() {
    return (
        <div className="cta-quick" role="region" aria-label="Lối tắt ECO 2024+">
            <span className="cta-quick__title">Lối tắt:</span>
            <nav className="cta-quick__links" aria-label="Blueprint và 4 domain">
                {links.map((l) => (
                    <Link
                        key={l.to}
                        className={l.variant === 'solid' ? 'button button--brand' : 'button button--brand-ghost'}
                        to={l.to}
                    >
                        {l.label}
                    </Link>
                ))}
            </nav>
            <span className="pill-badge" aria-label="ECO 2024+ bốn domain">ECO 2024+ · 4 domain</span>
        </div>
    );
}
