import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'PMI-ACP',
      // category.link chỉ nhận 'generated-index' | 'doc'
      link: { type: 'generated-index', title: 'PMI-ACP' },
      items: [
        // Thêm link tới trang pages Start Here ở mức item (hợp lệ)
        { type: 'link', label: 'Start Here', href: '/start-here' },

        {
          type: 'category',
          label: 'Module 01 – Agile Mindset',
          link: { type: 'generated-index', title: 'Module 01 – Agile Mindset' },
          items: [
            'pmi-acp/module-01/lesson-01',
            'pmi-acp/module-01/lesson-02',
          ],
        },
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
      ],
    },
  ],
};

export default sidebars;
