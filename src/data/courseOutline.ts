// src/data/courseOutline.ts
// Data tối giản: chỉ tiêu đề + loại bài (article/quiz).
// Có "group" ở cấp Part để bạn dễ lọc ở trang Home (ví dụ group === 'short').

export type LessonKind = 'article' | 'quiz';

export interface Lesson {
    id: number;        // Giữ ID theo dải đã liệt kê để sau này map tiến độ
    title: string;     // Tiêu đề bài viết
    kind: LessonKind;  // 'article' | 'quiz'
    // slug?: string;  // (tuỳ chọn) khi có đường dẫn docs thật sự thì thêm
}

export interface Part {
    id: number;
    title: string;
    lessons: Lesson[];
    group?: 'short' | 'domain' | 'review' | 'mock'; // dùng cho UI Home (card điều hướng)
}

/* =========================
   PHẦN 1 — Course Introduction
   ========================= */
const part1: Part = {
    id: 1,
    title: 'Course Introduction',
    group: 'review', // hoặc bỏ trống; không ảnh hưởng gì
    lessons: [
        { id: 1, title: 'Exam Eligibility', kind: 'article' },
        { id: 2, title: 'Course Introduction', kind: 'article' },
        { id: 3, title: 'Exam Information', kind: 'article' },
        { id: 4, title: 'Exam Breakdown', kind: 'article' },
        { id: 5, title: 'PMI Audit', kind: 'article' },
        { id: 6, title: 'Tips for success', kind: 'article' },
        { id: 7, title: 'Materials to download', kind: 'article' },
    ],
};

/* =========================
   PHẦN 2 — Bài ngắn – Trọng tâm (Agile & Project Fundamentals)
   => dùng làm "card điều hướng" ở trang Home
   ========================= */
const part2: Part = {
    id: 2,
    title: 'Bài ngắn – Trọng tâm (Agile & Project Fundamentals)',
    group: 'short',
    lessons: [
        { id: 8, title: 'PM Basics Section Intro', kind: 'article' },
        { id: 9, title: 'What is a Project', kind: 'article' },
        { id: 10, title: 'What is Project Management', kind: 'article' },
        { id: 11, title: 'What is Program Management', kind: 'article' },
        { id: 12, title: 'What is Portfolio Management', kind: 'article' },
        { id: 13, title: 'Operations Management', kind: 'article' },
        { id: 14, title: 'What is the value of the project', kind: 'article' },
        { id: 15, title: 'Projects enable changes', kind: 'article' },
        { id: 16, title: 'Phases and Deliverables', kind: 'article' },
        { id: 17, title: 'Project Life Cycle', kind: 'article' },
        { id: 18, title: 'Project Governance', kind: 'article' },
        { id: 19, title: 'Stakeholders', kind: 'article' },
        { id: 20, title: 'Roles of a Project manager', kind: 'article' },
        { id: 21, title: 'What are milestones', kind: 'article' },
        { id: 22, title: 'Organizational Structures', kind: 'article' },
        { id: 23, title: 'Project Boss', kind: 'article' },
        { id: 24, title: 'Areas of a project', kind: 'article' },
        { id: 25, title: 'Project Management Office', kind: 'article' },
        { id: 26, title: 'Product vs Project Management', kind: 'article' },
        { id: 27, title: 'Risk vs. Issues vs. Assumptions vs. Constraints', kind: 'article' },
        { id: 28, title: 'Project Constraints', kind: 'article' },
        { id: 29, title: 'Approaches', kind: 'article' },
        { id: 30, title: 'Emotional Intelligence', kind: 'article' },
        { id: 31, title: 'Leadership vs. Management', kind: 'article' },
        { id: 99901, title: 'PM Basics Quiz', kind: 'quiz' }, // Quiz tổng phần
    ],
};

/* =========================
   PHẦN 3 — Domain 1: Mindset
   ========================= */
const part3: Part = {
    id: 3,
    title: 'Domain 1: Mindset',
    group: 'domain',
    lessons: [
        { id: 32, title: 'What is Agile', kind: 'article' },
        { id: 33, title: 'Iterative vs. Incremental', kind: 'article' },
        { id: 34, title: 'Agile Benefits', kind: 'article' },
        { id: 35, title: 'What is Value', kind: 'article' },
        { id: 36, title: 'Delivering Value Incrementally', kind: 'article' },
        { id: 37, title: 'Agile Declaration of Interdependence', kind: 'article' },
        { id: 38, title: 'Agile mindset', kind: 'article' },
        { id: 39, title: 'Agile vs. Traditional', kind: 'article' },
        { id: 40, title: 'Inverting the triangle', kind: 'article' },
        { id: 41, title: 'Agile Values', kind: 'article' },
        { id: 42, title: 'Agile Guiding Principles', kind: 'article' },
        { id: 43, title: 'Different Agile Methods', kind: 'article' },
        { id: 44, title: 'Scrum Process', kind: 'article' },
        { id: 45, title: 'Scrum Roles and Responsibilities', kind: 'article' },
        { id: 46, title: 'Scrum Activities', kind: 'article' },
        { id: 47, title: 'Scrum artifacts', kind: 'article' },
        { id: 48, title: 'Definition of Done', kind: 'article' },
        { id: 49, title: 'XP Terms', kind: 'article' },
        { id: 50, title: 'XP Practices', kind: 'article' },
        { id: 51, title: 'Scrum vs XP', kind: 'article' },
        { id: 52, title: 'Lean Software Developement', kind: 'article' },
        { id: 53, title: 'Kanban Development', kind: 'article' },
        { id: 54, title: 'Feature-Driven Development (FDD)', kind: 'article' },
        { id: 55, title: 'Crystal', kind: 'article' },
        { id: 56, title: 'SAFe', kind: 'article' },
        { id: 57, title: 'Disciplined Agile (DA)', kind: 'article' },
        { id: 99902, title: 'Domain 1 Quiz', kind: 'quiz' },
    ],
};

/* =========================
   PHẦN 4 — Domain 2: Leadership (21 bài)
   → 20 bài + 1 quiz
   ========================= */
const part4: Part = {
    id: 4,
    title: 'Domain 2: Leadership',
    group: 'domain',
    lessons: [
        { id: 58, title: 'Servant Leadership Basics', kind: 'article' },
        { id: 59, title: 'Team Charter & Working Agreements', kind: 'article' },
        { id: 60, title: 'Psychological Safety', kind: 'article' },
        { id: 61, title: 'Facilitation Techniques (Dot Voting, FoF)', kind: 'article' },
        { id: 62, title: 'Decision-Making (Consensus, Consent, RAPID)', kind: 'article' },
        { id: 63, title: 'Conflict Management Styles', kind: 'article' },
        { id: 64, title: 'Motivation & Intrinsic Drivers', kind: 'article' },
        { id: 65, title: 'Coaching vs Mentoring', kind: 'article' },
        { id: 66, title: 'Tuckman Stages & Team Dynamics', kind: 'article' },
        { id: 67, title: 'Communication Radiators & Information Flow', kind: 'article' },
        { id: 68, title: 'Feedback Loops & 1:1s', kind: 'article' },
        { id: 69, title: 'Stakeholder Engagement & Influencing', kind: 'article' },
        { id: 70, title: 'Negotiation & Win–Win Mindset', kind: 'article' },
        { id: 71, title: 'Leading without Authority', kind: 'article' },
        { id: 72, title: 'Diversity, Inclusion & Bias Awareness', kind: 'article' },
        { id: 73, title: 'Distributed/Remote Team Practices', kind: 'article' },
        { id: 74, title: 'Performance, Rewards & Recognition', kind: 'article' },
        { id: 75, title: 'Retrospectives that Work', kind: 'article' },
        { id: 76, title: 'Leadership Anti-Patterns', kind: 'article' },
        { id: 77, title: 'Ethics & Professional Conduct', kind: 'article' },
        { id: 99903, title: 'Domain 2 Quiz', kind: 'quiz' },
    ],
};

/* =========================
   PHẦN 5 — Domain 3: Product (38 bài)
   → 37 bài + 1 quiz
   ========================= */
const part5: Part = {
    id: 5,
    title: 'Domain 3: Product',
    group: 'domain',
    lessons: [
        { id: 78, title: 'Product Vision & Strategy', kind: 'article' },
        { id: 79, title: 'Outcomes vs Outputs', kind: 'article' },
        { id: 80, title: 'Roadmap (Now–Next–Later)', kind: 'article' },
        { id: 81, title: 'Release Planning', kind: 'article' },
        { id: 82, title: 'Backlog Creation & Ownership', kind: 'article' },
        { id: 83, title: 'Backlog Refinement (Grooming)', kind: 'article' },
        { id: 84, title: 'Epic → Feature → Story', kind: 'article' },
        { id: 85, title: 'INVEST & Good User Stories', kind: 'article' },
        { id: 86, title: 'Acceptance Criteria & Examples', kind: 'article' },
        { id: 87, title: 'Definition of Ready / Done', kind: 'article' },
        { id: 88, title: 'Vertical Slicing Techniques', kind: 'article' },
        { id: 89, title: 'Story Mapping', kind: 'article' },
        { id: 90, title: 'Prioritization: MoSCoW', kind: 'article' },
        { id: 91, title: 'Prioritization: WSJF', kind: 'article' },
        { id: 92, title: 'Cost of Delay (CoD)', kind: 'article' },
        { id: 93, title: 'RICE & Other Models', kind: 'article' },
        { id: 94, title: 'Value Hypothesis & Assumptions', kind: 'article' },
        { id: 95, title: 'Experiment Design & A/B', kind: 'article' },
        { id: 96, title: 'MVP vs MMF', kind: 'article' },
        { id: 97, title: 'Agile Contracting (T&M, FP with change)', kind: 'article' },
        { id: 98, title: 'User Research & JTBD Basics', kind: 'article' },
        { id: 99, title: 'Personas & Segmentation', kind: 'article' },
        { id: 100, title: 'Value Stream & Waste', kind: 'article' },
        { id: 101, title: 'Risk-Adjusted Backlog', kind: 'article' },
        { id: 102, title: 'Dependency Management', kind: 'article' },
        { id: 103, title: 'Estimation: Story Points', kind: 'article' },
        { id: 104, title: 'Relative Sizing & Planning Poker', kind: 'article' },
        { id: 105, title: 'Flow Metrics: WIP, Lead/Cycle Time', kind: 'article' },
        { id: 106, title: 'Throughput & CFD', kind: 'article' },
        { id: 107, title: 'Release Burn-up/Burn-down', kind: 'article' },
        { id: 108, title: 'Roadmap Risks & Buffers', kind: 'article' },
        { id: 109, title: 'NFRs & Quality Attributes', kind: 'article' },
        { id: 110, title: 'UAT & Beta Programs', kind: 'article' },
        { id: 111, title: 'Go-to-Market Considerations', kind: 'article' },
        { id: 112, title: 'Analytics & Product KPIs', kind: 'article' },
        { id: 113, title: 'Kill/Persevere/Pivot Decisions', kind: 'article' },
        { id: 114, title: 'Prod–Eng Collaboration Patterns', kind: 'article' },
        { id: 115, title: 'Roadmap Anti-Patterns', kind: 'article' },
        { id: 99904, title: 'Domain 3 Quiz', kind: 'quiz' },
    ],
};

/* =========================
   PHẦN 6 — Domain 4: Delivery (5 bài)
   → 4 bài + 1 quiz
   ========================= */
const part6: Part = {
    id: 6,
    title: 'Domain 4: Delivery',
    group: 'domain',
    lessons: [
        { id: 116, title: 'Forecasting: Velocity & NoEstimates', kind: 'article' },
        { id: 117, title: 'Built-in Quality: TDD, CI/CD, Tech Debt', kind: 'article' },
        { id: 118, title: 'Impediments & Risk Visibility', kind: 'article' },
        { id: 119, title: 'Release Readiness & Handover', kind: 'article' },
        { id: 99905, title: 'Domain 4 Quiz', kind: 'quiz' },
    ],
};

/* =========================
   PHẦN 7 — Exam Content Outline (ECO) Review (25 bài)
   → 24 bài + 1 mini-mock
   ========================= */
const part7: Part = {
    id: 7,
    title: 'Exam Content Outline (ECO) Review',
    group: 'review',
    lessons: [
        { id: 120, title: 'Blueprint 2025 — Domain & Weights', kind: 'article' },
        { id: 121, title: 'Tasks & Enablers — Bản rút gọn', kind: 'article' },
        { id: 122, title: 'Mapping Câu hỏi ↔ Enabler', kind: 'article' },
        { id: 123, title: 'Tư duy Scenario-based', kind: 'article' },
        { id: 124, title: 'Bẫy đề phổ biến & Mẹo loại trừ', kind: 'article' },
        { id: 125, title: 'Mindset trước Quy trình', kind: 'article' },
        { id: 126, title: 'Leadership — trọng tâm ECO', kind: 'article' },
        { id: 127, title: 'Product — trọng tâm ECO', kind: 'article' },
        { id: 128, title: 'Delivery — trọng tâm ECO', kind: 'article' },
        { id: 129, title: 'Đạo đức nghề nghiệp (Code of Ethics)', kind: 'article' },
        { id: 130, title: 'Quản trị Stakeholder theo ECO', kind: 'article' },
        { id: 131, title: 'Thông tin/Truyền thông theo ECO', kind: 'article' },
        { id: 132, title: 'Rủi ro/Impediment theo ECO', kind: 'article' },
        { id: 133, title: 'Ưu tiên giá trị & WSJF theo ECO', kind: 'article' },
        { id: 134, title: 'Metrics cần nhớ (Lead/Cycle, CFD...)', kind: 'article' },
        { id: 135, title: 'QA & DoD/DoR trong ECO', kind: 'article' },
        { id: 136, title: 'Estimate & Forecast theo ECO', kind: 'article' },
        { id: 137, title: 'Planning & Cadence trong ECO', kind: 'article' },
        { id: 138, title: 'Visual Management & Radiators', kind: 'article' },
        { id: 139, title: 'Tổng hợp Thuật ngữ dễ nhầm', kind: 'article' },
        { id: 140, title: 'Exam Strategy (Timebox, Flag, Review)', kind: 'article' },
        { id: 141, title: 'Checklist ôn thi theo tuần', kind: 'article' },
        { id: 142, title: 'Cheat Sheets nén — Domain x', kind: 'article' },
        { id: 143, title: 'Cheat Sheets nén — Domain y', kind: 'article' },
        { id: 99906, title: 'ECO Mini-Mock', kind: 'quiz' },
    ],
};

/* =========================
   PHẦN 8 — Ôn nhanh Agile Mindset (6 bài)
   ========================= */
const part8: Part = {
    id: 8,
    title: 'Ôn nhanh Agile Mindset',
    group: 'review',
    lessons: [
        { id: 144, title: 'Agile Values — ôn nhanh', kind: 'article' },
        { id: 145, title: 'Agile Principles — ôn nhanh', kind: 'article' },
        { id: 146, title: 'Ưu tiên Giá trị hơn Thủ tục', kind: 'article' },
        { id: 147, title: 'Hành vi Agile nên/chưa nên', kind: 'article' },
        { id: 148, title: 'Anti-patterns thường gặp', kind: 'article' },
        { id: 149, title: 'Scenario luyện phản xạ Mindset', kind: 'article' },
    ],
};

/* =========================
   PHẦN 9 — Mock Exams & Certificate (9 bài)
   ========================= */
const part9: Part = {
    id: 9,
    title: 'Mock Exams & Certificate',
    group: 'mock',
    lessons: [
        { id: 150, title: 'Mini Mock 30', kind: 'quiz' },
        { id: 151, title: 'Domain Drills — Mindset (20)', kind: 'quiz' },
        { id: 152, title: 'Domain Drills — Leadership (20)', kind: 'quiz' },
        { id: 153, title: 'Domain Drills — Product (20)', kind: 'quiz' },
        { id: 154, title: 'Domain Drills — Delivery (20)', kind: 'quiz' },
        { id: 155, title: 'Mock 50 (Beginner)', kind: 'quiz' },
        { id: 156, title: 'Mock 120 (Advanced)', kind: 'quiz' },
        { id: 157, title: 'Review Playbook & Error Log', kind: 'article' },
        { id: 158, title: 'Exam Day & Certificate (PDU)', kind: 'article' },
    ],
};

/* =========================
   EXPORT
   ========================= */
export const parts: Part[] = [part1, part2, part3, part4, part5, part6, part7, part8, part9];
