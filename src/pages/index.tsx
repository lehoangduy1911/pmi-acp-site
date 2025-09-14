// src/pages/index.tsx
import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import styles from './index.module.css';

export default function Home() {
  return (
    <Layout
      title="VNOptimus — Học & Luyện thi PMI-ACP"
      description="Lộ trình 6 tuần, bài học ngắn, checklist và thi thử PMI-ACP. Song ngữ vi/en."
    >
      {/* Skip link for accessibility */}
      <a href="#main-content" className={styles.skipLink}>Bỏ qua nội dung</a>

      {/* HERO */}
      <header className={clsx('hero', 'hero--primary', styles.hero)}>
        <div className="container">
          <h1 className="hero__title">Học & Luyện thi PMI-ACP</h1>
          <p className="hero__subtitle">
            Lộ trình 6 tuần • Bài học ngắn • Checklist hàng ngày • Song ngữ vi/en
          </p>

          <div className={styles.ctaGroup} role="group" aria-label="Hero actions">
            <Link
              className={clsx('button', 'button--secondary', 'button--lg')}
              to="/start-here"
              aria-label="Start Here PMI-ACP"
            >
              Start Here
            </Link>

            <Link
              className={clsx('button', 'button--lg', styles.altButton)}
              to="/docs/pmi-acp/plan/week-1"
              aria-label="Xem kế hoạch học 6 tuần"
            >
              Kế hoạch học
            </Link>

            {/* ✅ Chuyển mượt trong SPA về route nội bộ /mock */}
            <Link
              className={clsx('button', 'button--outline', 'button--lg')}
              to="/mock"
              aria-label="Mở trang thi thử PMI-ACP (client-side)"
            >
              Mock 50/120 →
            </Link>
          </div>
        </div>
      </header>

      <main id="main-content">
        {/* 4 LỢI ÍCH */}
        <section className={styles.section}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Vì sao chọn VNOptimus?</h2>
            <div className={styles.cardGrid}>
              {/* Card 1 */}
              <Link
                to="/docs/pmi-acp/plan/week-1"
                className={styles.card + ' ' + styles.cardLink}
                aria-label="Lộ trình 6 tuần — Xem Tuần 1"
              >
                <div className={styles.cardIcon}>📅</div>
                <h3 className={styles.cardTitle}>Lộ trình 6 tuần</h3>
                <p className={styles.cardDesc}>
                  Chia nhỏ theo tuần, mục tiêu rõ ràng từng ngày. Dễ theo dõi và duy trì thói quen.
                </p>
                <span className={styles.cardCta}>Xem Tuần 1 →</span>
              </Link>

              {/* Card 2 */}
              <Link
                to="/docs/pmi-acp/domains/domain-mindset"
                className={styles.card + ' ' + styles.cardLink}
                aria-label="Bài ngắn, trọng tâm — Vào học ngay"
              >
                <div className={styles.cardIcon}>⚡️</div>
                <h3 className={styles.cardTitle}>Bài ngắn, trọng tâm</h3>
                <p className={styles.cardDesc}>
                  Mỗi bài 5–10 phút, đi thẳng vào khái niệm và ví dụ áp dụng thực tế.
                </p>
                <span className={styles.cardCta}>Vào học ngay →</span>
              </Link>

              {/* Card 3 */}
              <Link
                to="/docs/pmi-acp/plan/week-2"
                className={styles.card + ' ' + styles.cardLink}
                aria-label="Checklist luyện đề — Bắt đầu checklist"
              >
                <div className={styles.cardIcon}>✅</div>
                <h3 className={styles.cardTitle}>Checklist luyện đề</h3>
                <p className={styles.cardDesc}>
                  Bài tập và mini-mock theo ngày giúp nắm chắc kiến thức & tiến bộ đều.
                </p>
                <span className={styles.cardCta}>Bắt đầu checklist →</span>
              </Link>

              {/* Card 4 */}
              <Link
                to="/start-here"
                className={styles.card + ' ' + styles.cardLink}
                aria-label="Song ngữ vi/en — Cách dùng song ngữ"
              >
                <div className={styles.cardIcon}>🌐</div>
                <h3 className={styles.cardTitle}>Song ngữ vi/en</h3>
                <p className={styles.cardDesc}>
                  Toggle chuyển ngữ ở mọi trang giúp bạn quen thuật ngữ tiếng Anh trước kỳ thi.
                </p>
                <span className={styles.cardCta}>Cách dùng song ngữ →</span>
              </Link>
            </div>
          </div>
        </section>

        {/* STEPS */}
        <section className={styles.sectionAlt}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Học theo 4 bước</h2>
            <ol className={styles.steps}>
              <li className={styles.stepItem}>
                <div className={styles.stepIndex}>1</div>
                <div className={styles.stepBody}>
                  <h4>Bắt đầu</h4>
                  <p>Xem định hướng & cách học hiệu quả.</p>
                  <Link to="/start-here" className="button button--sm button--link">
                    Start here →
                  </Link>
                </div>
              </li>
              <li className={styles.stepItem}>
                <div className={styles.stepIndex}>2</div>
                <div className={styles.stepBody}>
                  <h4>Học nhanh</h4>
                  <p>Vào các bài trọng tâm của Module 01.</p>
                  <Link to="/docs/pmi-acp/domains/domain-mindset" className="button button--sm button--link">
                    Lesson 01 →
                  </Link>
                </div>
              </li>
              <li className={styles.stepItem}>
                <div className={styles.stepIndex}>3</div>
                <div className={styles.stepBody}>
                  <h4>Luyện đề</h4>
                  <p>Làm mini-mock & checklist theo tuần.</p>
                  <Link to="/docs/pmi-acp/plan/week-3" className="button button--sm button--link">
                    Tuần 3 →
                  </Link>
                </div>
              </li>
              <li className={styles.stepItem}>
                <div className={styles.stepIndex}>4</div>
                <div className={styles.stepBody}>
                  <h4>Thi thử</h4>
                  <p>Tổng ôn & 2 mock 120 câu trước khi thi thật.</p>
                  {/* Route nội bộ /mock */}
                  <Link to="/mock" className="button button--sm button--link">
                    Thi thử →
                  </Link>
                </div>
              </li>
            </ol>
          </div>
        </section>
      </main>
    </Layout>
  );
}
