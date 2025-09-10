import React from 'react';
import Layout from '@theme/Layout';

export default function MockPage() {
    // Trang nội bộ /mock nhúng mock tĩnh qua iframe
    return (
        <Layout title="Mock PMI-ACP" description="Thi thử PMI-ACP (client-side)">
            <div style={{ height: 'calc(100vh - var(--ifm-navbar-height))' }}>
                <iframe
                    src="/mock/index.html"
                    title="Mock PMI-ACP"
                    style={{ border: 0, width: '100%', height: '100%' }}
                    loading="eager"
                />
            </div>
        </Layout>
    );
}
