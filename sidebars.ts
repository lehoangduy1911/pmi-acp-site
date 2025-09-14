import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'PMI-ACP',
      // category.link chỉ nhận 'generated-index' | 'doc'
      link: { type: 'generated-index', title: 'PMI-ACP' },
      items: [
        // Trang ngoài Docs
        { type: 'link', label: 'Start Here', href: '/start-here' },

        // ❌ ĐÃ ẨN: Module 01 – Agile Mindset (không liệt kê vào sidebar nữa)
        // (Nếu cần lưu trữ, di chuyển file vào docs/_archive và giữ redirects trong config)

        {
          type: 'category',
          label: 'Kế hoạch học',
          link: { type: 'generated-index', title: 'Kế hoạch học' },
          items: [
            'pmi-acp/plan/week-1',
            'pmi-acp/plan/week-2',
            'pmi-acp/plan/week-3',
            'pmi-acp/plan/week-4',
            'pmi-acp/plan/week-5',
            'pmi-acp/plan/week-6',
          ],
        },

        // ✅ Nhóm mới: ACP Blueprint 2025 (VI/EN) + Domains
        {
          type: 'category',
          label: 'ACP Blueprint 2025',
          link: { type: 'generated-index', title: 'ACP Blueprint 2025' },
          items: [
            // Trang tổng quan 4 domain + trọng số + Tasks/Enablers rút gọn
            'pmi-acp/blueprint-2025',

            // Nhóm con: 4 domain (mỗi trang có Tabs VI/EN, Must-know, Pitfalls, Quiz 10 câu)
            {
              type: 'category',
              label: 'Domains',
              link: { type: 'generated-index', title: 'Domains (VI/EN)' },
              items: [
                'pmi-acp/domains/domain-mindset',
                'pmi-acp/domains/domain-leadership',
                'pmi-acp/domains/domain-product',
                'pmi-acp/domains/domain-delivery',
              ],
            },
          ],
        },

        // (Tuỳ chọn) Legacy lưu trữ nếu muốn hiển thị riêng
        // {
        //   type: 'category',
        //   label: 'Foundations (Legacy)',
        //   collapsed: true,
        //   link: { type: 'generated-index', title: 'Foundations (Legacy)' },
        //   items: [
        //     'pmi-acp/module-01/lesson-01',
        //     'pmi-acp/module-01/lesson-02',
        //   ],
        // },
      ],
    },
  ],
};

export default sidebars;
