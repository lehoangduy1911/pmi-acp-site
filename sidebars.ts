import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'PMI-ACP',
      link: { type: 'doc', id: 'pmi-acp/start-here' },
      items: [
        {
          type: 'category',
          label: 'Module 1 – Agile Mindset',
          link: { type: 'generated-index', title: 'Module 1 – Agile Mindset' },
          items: [
            'pmi-acp/module-1/agile-principles',
            'pmi-acp/module-1/agile-vs-scrum-kanban',
          ],
        },
        {
          type: 'category',
          label: 'Kế hoạch 4 tuần',
          link: { type: 'generated-index', title: 'Kế hoạch 4 tuần' },
          items: [
            'pmi-acp/plan/week-1',
            'pmi-acp/plan/week-2',
            'pmi-acp/plan/week-3',
            'pmi-acp/plan/week-4',
          ],
        },
      ],
    },
  ],
};

export default sidebars;
