import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function Home(): JSX.Element {
  return (
    <Layout
      title="Học & Luyện thi PMI-ACP"
      description="Ghi chép, lộ trình và ngân hàng câu hỏi luyện thi PMI-ACP."
    >
      <header className="hero hero--primary" style={{ padding: '4rem 0' }}>
        <div className="container">
          <h1 className="hero__title">Học & Luyện thi PMI-ACP</h1>
          <p className="hero__subtitle">
            Lộ trình 4 tuần • Bài học ngắn • Checklist luyện đề mỗi ngày
          </p>
          <div style={{ marginTop: 24 }}>
            <Link className="button button--secondary button--lg" to="/docs/pmi-acp/start-here">
              Bắt đầu học ngay
            </Link>
          </div>
        </div>
      </header>
    </Layout>
  );
}
