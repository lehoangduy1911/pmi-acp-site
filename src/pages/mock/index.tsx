// src/pages/mock/index.tsx
import React from 'react';
import Layout from '@theme/Layout';

export default function MockBridge() {
    // Luôn mở file tĩnh đã build ra ở /mock/index.html
    const href = '/mock/index.html';

    return (
        <Layout title="Mock PMI-ACP" noNavbar noFooter>
            {/* full-bleed, không thanh cuộn */}
            <div style={{ position: 'fixed', inset: 0, background: '#0b1022' }}>
                <iframe
                    title="PMI-ACP Mock"
                    src={href}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
                    loading="eager"
                />
                <noscript>
                    <div style={{ position: 'absolute', top: 16, left: 16, right: 16, padding: 12, borderRadius: 12, background: 'white' }}>
                        Ứng dụng cần JavaScript. Mở trực tiếp <a href={href}>/mock/index.html</a>.
                    </div>
                </noscript>
            </div>
        </Layout>
    );
}
