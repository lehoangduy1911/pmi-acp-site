// scripts/gen-lessons.mjs
// Node ESM script to generate bilingual (VI/EN) MDX docs with Tabs,
// safe YAML front matter (JSON-quoted), and predictable slugs/file names.

import fsp from 'fs/promises';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = process.cwd();
const DOCS_BASE = path.resolve(ROOT, 'docs/pmi-acp');
const FORCE = process.argv.includes('--force');

const ensureDir = async (p) => {
  await fsp.mkdir(p, { recursive: true });
};
const exists = async (p) => {
  try {
    await fsp.access(p, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
};

// Remove accents + keep a-z0-9-hyphen; collapse dashes
const slugify = (str) =>
  String(str || '')
    .normalize('NFD')
    .replace(/\p{Diacritic}+/gu, '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

// Always JSON-quote values to avoid YAML parsing issues (&, :, quotes…)
const frontMatter = (meta) => {
  const lines = Object.entries(meta).map(([k, v]) => `${k}: ${JSON.stringify(v)}`);
  return `---\n${lines.join('\n')}\n---\n\n`;
};

// Bilingual Tabs (HTML inside TabItem to avoid MDX list/blockquote pitfalls)
const bodyTabs = (title, kind) => `
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="lang">
  <TabItem value="vi" label="VI" default>
    ${kind === 'quiz'
    ? `<p><strong>Quiz (VI)</strong> — sẽ hiển thị bộ câu hỏi tương ứng.</p>`
    : `<h2>Tóm tắt (VI)</h2>
<p>Đây là khung bài <strong>${title}</strong> (tiếng Việt).</p>`
  }
  </TabItem>
  <TabItem value="en" label="EN">
    ${kind === 'quiz'
    ? `<p><strong>Quiz (EN)</strong> — the quiz will appear here.</p>`
    : `<h2>Summary (EN)</h2>
<p>This is the <strong>${title}</strong> skeleton (English).</p>`
  }
  </TabItem>
</Tabs>
`;

// -------------------------------
// Data model
// -------------------------------

/** @typedef {{ title: string, kind?: 'article'|'quiz' }} Lesson */
/** @typedef {{ sub: string, lessons: Lesson[] }} Part */

const courseIntro = /** @type {Part} */ ({
  sub: 'course/intro',
  lessons: [
    { title: 'Exam Eligibility' },
    { title: 'Course Introduction' },
    { title: 'Exam Information' },
    { title: 'Exam Breakdown' },
    { title: 'PMI Audit' },
    { title: 'Tips for Success' },
    { title: 'Materials to Download' },
  ],
});

const courseShort = /** @type {Part} */ ({
  sub: 'course/short',
  lessons: [
    { title: 'PM Basics — Section Intro' },
    { title: 'What Is a Project' },
    { title: 'What Is Project Management' },
    { title: 'What Is Program Management' },
    { title: 'What Is Portfolio Management' },
    { title: 'Operations Management' },
    { title: 'What Is the Value of the Project' },
    { title: 'Projects Enable Changes' },
    { title: 'Phases and Deliverables' },
    { title: 'Project Life Cycle' },
    { title: 'Project Governance' },
    { title: 'Stakeholders' },
    { title: 'Roles of a Project Manager' },
    { title: 'What Are Milestones' },
    { title: 'Organizational Structures' },
    { title: 'Project Boss' },
    { title: 'Areas of a Project' },
    { title: 'Project Management Office' },
    { title: 'Product vs Project Management' },
    { title: 'Risk vs Issues vs Assumptions vs Constraints' },
    { title: 'Project Constraints' },
    { title: 'Approaches' },
    { title: 'Emotional Intelligence' },
    { title: 'Leadership vs Management' },
  ],
});

const domainsMindset = /** @type {Part} */ ({
  sub: 'domains/mindset',
  lessons: [
    { title: 'What Is Agile' },
    { title: 'Iterative vs Incremental' },
    { title: 'Agile Benefits' },
    { title: 'What Is Value' },
    { title: 'Delivering Value Incrementally' },
    { title: 'Agile Declaration of Interdependence' },
    { title: 'Agile Mindset' },
    { title: 'Agile vs Traditional' },
    { title: 'Inverting the Triangle' },
    { title: 'Agile Values' },
    { title: 'Agile Guiding Principles' },
    { title: 'Different Agile Methods' },
    { title: 'Scrum Process' },
    { title: 'Scrum Roles and Responsibilities' },
    { title: 'Scrum Activities' },
    { title: 'Scrum Artifacts' },
    { title: 'Definition of Done' },
    { title: 'XP Terms' },
    { title: 'XP Practices' },
    { title: 'Scrum vs XP' },
    { title: 'Lean Software Developement' }, // (giữ y nguyên để khớp slug cũ)
    { title: 'Kanban Development' },
    { title: 'Feature-Driven Development (FDD)' },
    { title: 'Crystal' },
    { title: 'SAFe' },
    { title: 'Disciplined Agile (DA)' },
  ],
});

const domainsLeadership = /** @type {Part} */ ({
  sub: 'domains/leadership',
  lessons: [
    { title: 'Servant Leadership Basics' },
    { title: 'Team Charter and Working Agreements' },
    { title: 'Psychological Safety' },
    { title: 'Facilitation Techniques — Dot Voting & FOF' },
    { title: 'Decision Making — Consensus, Consent, RAPID' },
    { title: 'Conflict Management Styles' },
    { title: 'Motivation and Intrinsic Drivers' },
    { title: 'Coaching vs Mentoring' },
    { title: 'Tuckman Stages and Team Dynamics' },
    { title: 'Communication Radiators and Information Flow' },
    { title: 'Feedback Loops and 1-1s' },
    { title: 'Stakeholder Engagement and Influencing' },
    { title: 'Negotiation and Win–Win Mindset' },
    { title: 'Leading Without Authority' },
    { title: 'Diversity, Inclusion, and Bias Awareness' },
    { title: 'Distributed/Remote Team Practices' },
    { title: 'Performance, Rewards, and Recognition' },
    { title: 'Retrospectives That Work' },
    { title: 'Leadership Anti-Patterns' },
    { title: 'Ethics and Professional Conduct' },
  ],
});

const domainsProduct = /** @type {Part} */ ({
  sub: 'domains/product',
  lessons: [
    { title: 'Product Vision and Strategy' },
    { title: 'Outcomes vs Outputs' },
    { title: 'Roadmap — Now/Next/Later' },
    { title: 'Release Planning' },
    { title: 'Backlog — Creation and Ownership' },
    { title: 'Backlog — Refinement / Grooming' },
    { title: 'Epic / Feature / Story' },
    { title: 'INVEST and Good User Stories' },
    { title: 'Acceptance Criteria and Examples' },
    { title: 'Definition of Ready / Done' },
    { title: 'Vertical Slicing Techniques' },
    { title: 'Story Mapping' },
    { title: 'Prioritization — MoSCoW' },
    { title: 'Prioritization — WSJF' },
    { title: 'Cost of Delay (CoD)' },
    { title: 'RICE and Other Models' },
    { title: 'Value Hypothesis and Assumptions' },
    { title: 'Experiment Design and A/B' },
    { title: 'MVP vs MMF' },
    { title: 'Agile Contracting — T&M / FP with Change' },
    { title: 'User Research and JTBD Basics' },
    { title: 'Personas and Segmentation' },
    { title: 'Value Stream and Waste' },
    { title: 'Risk-Adjusted Backlog' },
    { title: 'Dependency Management' },
    { title: 'Estimation — Story Points' },
    { title: 'Relative Sizing and Planning Poker' },
    { title: 'Flow Metrics — WIP, Lead/Cycle Time' },
    { title: 'Throughput and CFD' },
    { title: 'Release Burn-up / Burn-down' },
    { title: 'Roadmap — Risks and Buffers' },
    { title: 'NFRs and Quality Attributes' },
    { title: 'UAT and Beta Programs' },
    { title: 'Go-to-Market Considerations' },
    { title: 'Analytics and Product KPIs' },
    { title: 'Kill / Persevere / Pivot Decisions' },
    { title: 'Prod–Eng Collaboration Patterns' },
    { title: 'Roadmap Anti-Patterns' },
  ],
});

const domainsDelivery = /** @type {Part} */ ({
  sub: 'domains/delivery',
  lessons: [
    { title: 'Forecasting: Velocity & NoEstimates' },
    { title: 'Built-in Quality — TDD, CI/CD, Tech Debt' },
    { title: 'Impediments and Risk Visibility' },
    { title: 'Release Readiness and Handover' },
  ],
});

const eco = /** @type {Part} */ ({
  sub: 'eco',
  lessons: [
    { title: 'Blueprint 2025 — Domain & Weights' },
    { title: 'Tasks & Enablers — Bản rút gọn' },
    { title: 'Mapping Câu hỏi — Enabler' },
    { title: 'Tư duy Scenario-based' },
    { title: 'Bẫy dễ phổ biến & Mẹo loại trừ' },
    { title: 'Mindset trước quy trình' },
    { title: 'Leadership — Trọng tâm ECO' },
    { title: 'Product — Trọng tâm ECO' },
    { title: 'Delivery — Trọng tâm ECO' },
    { title: 'Ấn ởc Nghề nghiệp — Code of Ethics' },
    { title: 'Quản trị Stakeholder theo ECO' },
    { title: 'Thông tin & Truyền thông theo ECO' },
    { title: 'Rủi ro & Impediment theo ECO' },
    { title: 'Ưu tiên giá trị & WSJF theo ECO' },
    { title: 'Metrics căn bản — Lead/Cycle/CFD' },
    { title: 'QA & DoD/DoR theo ECO' },
    { title: 'Estimate & Forecast theo ECO' },
    { title: 'Planning & Cadence theo ECO' },
    { title: 'Visual Management & Radiators' },
    { title: 'Tổng hợp thuật ngữ dễ nhầm' },
    { title: 'Exam Strategy — Timebox/Flag/Review' },
    { title: 'Checklist ôn thi theo tuần' },
    { title: 'Cheat Sheets — Nên (Domain X)' },
    { title: 'Cheat Sheets — Nên (Domain Y)' },
  ],
});

const mindsetReview = /** @type {Part} */ ({
  sub: 'mindset-review',
  lessons: [
    { title: 'Agile Values — Ôn nhanh' },
    { title: 'Agile Principles — Ôn nhanh' },
    { title: 'Ưu tiên giá trị hơn thủ tục' },
    { title: 'Hành vi Agile — Nên/Chưa nên' },
    { title: 'Anti-patterns thường gặp' },
    { title: 'Scenario — Luyện phản xạ Mindset' },
  ],
});

const mock = /** @type {Part} */ ({
  sub: 'mock',
  lessons: [
    { title: 'Review Playbook & Error Log' },
    { title: 'Exam Day & Certificate / PDU' },
  ],
});

// Assemble all parts
const PARTS = [
  courseIntro,
  courseShort,
  domainsMindset,
  domainsLeadership,
  domainsProduct,
  domainsDelivery,
  eco,
  mindsetReview,
  mock,
];

// -------------------------------
// Write files
// -------------------------------

async function generate() {
  let created = 0;
  let skipped = 0;
  let overwritten = 0;

  for (const part of PARTS) {
    const absDir = path.join(DOCS_BASE, part.sub);
    await ensureDir(absDir);

    let pos = 1;
    for (const lesson of part.lessons) {
      const title = String(lesson.title).trim();
      const base = slugify(title) || `item-${pos}`;
      const slug = `/pmi-acp/${part.sub}/${base}`;
      const fname = `${String(pos).padStart(2, '0')}-${base}.mdx`;
      const filePath = path.join(absDir, fname);

      const fm = frontMatter({
        id: base,
        title,
        sidebar_label: title,
        slug,
        sidebar_position: pos,
        description: `WIP — Bài viết "${title}".`,
        tags: [lesson.kind === 'quiz' ? 'quiz' : 'article'],
      });

      const content = fm + bodyTabs(title, lesson.kind);

      if (await exists(filePath)) {
        if (FORCE) {
          await fsp.writeFile(filePath, content, 'utf8');
          overwritten++;
        } else {
          skipped++;
        }
      } else {
        await fsp.writeFile(filePath, content, 'utf8');
        created++;
      }

      pos++;
    }
  }

  console.log(`✅ Done. New: ${created}, Skipped: ${skipped}, Overwritten: ${overwritten}`);
  console.log(`🗂  Output base: ${DOCS_BASE}`);
}

generate().catch((e) => {
  console.error('❌ gen-lessons failed:', e);
  process.exit(1);
});
