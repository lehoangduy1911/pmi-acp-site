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
              to="/docs/pmi-acp/start-here"
              aria-label="Bắt đầu học PMI-ACP"
            >
              Bắt đầu học
            </Link>
            <Link
              className={clsx('button', 'button--lg', styles.altButton)}
              to="/docs/pmi-acp/plan/week-1"
              aria-label="Xem kế hoạch học 6 tuần"
            >
              Kế hoạch học
            </Link>
          </div>

        </div>
      </header>

      <main>
        {/* 4 LỢI ÍCH */}
        <section className={styles.section}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Vì sao chọn VNOptimus?</h2>
            <div className={styles.cardGrid}>
              <article className={styles.card}>
                <div className={styles.cardIcon}>📅</div>
                <h3 className={styles.cardTitle}>Lộ trình 6 tuần</h3>
                <p className={styles.cardDesc}>
                  Chia nhỏ theo tuần, mục tiêu rõ ràng từng ngày. Dễ theo dõi và duy trì thói quen.
                </p>
                <Link className="button button--sm button--link" to="/docs/pmi-acp/plan/week-1">
                  Xem Tuần 1 →
                </Link>
              </article>

              <article className={styles.card}>
                <div className={styles.cardIcon}>⚡️</div>
                <h3 className={styles.cardTitle}>Bài ngắn, trọng tâm</h3>
                <p className={styles.cardDesc}>
                  Mỗi bài 5–10 phút, đi thẳng vào khái niệm và ví dụ áp dụng thực tế.
                </p>
                <Link className="button button--sm button--link" to="/docs/pmi-acp/module-01/lesson-01">
                  Vào học ngay →
                </Link>
              </article>

              <article className={styles.card}>
                <div className={styles.cardIcon}>✅</div>
                <h3 className={styles.cardTitle}>Checklist luyện đề</h3>
                <p className={styles.cardDesc}>
                  Bài tập và mini-mock theo ngày giúp nắm chắc kiến thức & tiến bộ đều.
                </p>
                <Link className="button button--sm button--link" to="/docs/pmi-acp/plan/week-2">
                  Bắt đầu checklist →
                </Link>
              </article>

              <article className={styles.card}>
                <div className={styles.cardIcon}>🌐</div>
                <h3 className={styles.cardTitle}>Song ngữ vi/en</h3>
                <p className={styles.cardDesc}>
                  Toggle chuyển ngữ ở mọi trang giúp bạn quen thuật ngữ tiếng Anh trước kỳ thi.
                </p>
                <Link className="button button--sm button--link" to="/docs/pmi-acp/start-here">
                  Cách dùng song ngữ →
                </Link>
              </article>
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
                  <Link to="/docs/pmi-acp/start-here" className="button button--sm button--link">Start here →</Link>
                </div>
              </li>

              <li className={styles.stepItem}>
                <div className={styles.stepIndex}>2</div>
                <div className={styles.stepBody}>
                  <h4>Học nhanh</h4>
                  <p>Vào các bài trọng tâm của Module 01.</p>
                  <Link to="/docs/pmi-acp/module-01/lesson-01" className="button button--sm button--link">Lesson 01 →</Link>
                </div>
              </li>

              <li className={styles.stepItem}>
                <div className={styles.stepIndex}>3</div>
                <div className={styles.stepBody}>
                  <h4>Luyện đề</h4>
                  <p>Làm mini-mock & checklist theo tuần.</p>
                  <Link to="/docs/pmi-acp/plan/week-3" className="button button--sm button--link">Tuần 3 →</Link>
                </div>
              </li>

              <li className={styles.stepItem}>
                <div className={styles.stepIndex}>4</div>
                <div className={styles.stepBody}>
                  <h4>Thi thử</h4>
                  <p>Tổng ôn & 2 mock 120 câu trước khi thi thật.</p>
                  <Link to="/docs/pmi-acp/plan/week-6" className="button button--sm button--link">Week 6 →</Link>
                </div>
              </li>
            </ol>
          </div>
        </section>
      </main>
    </Layout>
  );
}
