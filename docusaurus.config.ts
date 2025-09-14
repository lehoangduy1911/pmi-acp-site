import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// ✅ Chỉ bật Plausible ở production
const isProd = process.env.NODE_ENV === 'production';

const config: Config = {
  title: 'VNOptimus',
  tagline: 'Dạy lại những gì đã học',
  favicon: 'img/favicon.ico',
  future: { v4: true },
  url: 'https://vnoptimus.vercel.app',
  baseUrl: '/',
  organizationName: 'lehoangduy1911',
  projectName: 'pmi-acp-site',

  // Cho phép href tới file tĩnh mà không fail build
  onBrokenLinks: 'ignore',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'vi',
    locales: ['vi', 'en'],
    localeConfigs: { vi: { label: 'Tiếng Việt' }, en: { label: 'English' } },
  },

  stylesheets: [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600&display=swap',
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/lehoangduy1911/pmi-acp-site/tree/main/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        blog: {
          showReadingTime: true,
          feedOptions: { type: ['rss', 'atom'], xslt: true },
          editUrl: 'https://github.com/lehoangduy1911/pmi-acp-site/tree/main/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: { customCss: './src/css/custom.css' },
      } satisfies Preset.Options,
    ],
  ],

  // Local search
  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        language: ['vi', 'en'],
        indexDocs: true,
        indexBlog: true,
        indexPages: true,
        docsRouteBasePath: '/docs',
        blogRouteBasePath: '/blog',
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      },
    ],
  ],

  // ✅ Redirect URL cũ của Module 01 → trang mới trong ACP Blueprint 2025
  // Giữ duy nhất 1 biến thể cho mỗi "from" (không kèm dấu "/" cuối) để tránh EEXIST.
  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          // lesson-01 → Mindset
          { from: '/docs/pmi-acp/module-01/lesson-01', to: '/docs/pmi-acp/domains/domain-mindset' },
          { from: '/pmi-acp/module-01/lesson-01', to: '/docs/pmi-acp/domains/domain-mindset' },

          // lesson-02 → Delivery
          { from: '/docs/pmi-acp/module-01/lesson-02', to: '/docs/pmi-acp/domains/domain-delivery' },
          { from: '/pmi-acp/module-01/lesson-02', to: '/docs/pmi-acp/domains/domain-delivery' },
        ],
      },
    ],
  ],

  // ✅ Scripts: outbound-links; analytics.js luôn bật để track CTA
  scripts: isProd
    ? [
      {
        src: 'https://plausible.io/js/script.outbound-links.js',
        defer: true,
        'data-domain': 'vnoptimus.vercel.app',
      } as any,
      { src: '/js/analytics.js', defer: true },
    ]
    : [{ src: '/js/analytics.js', defer: true }],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    docs: { sidebar: { hideable: true, autoCollapseCategories: true } },
    navbar: {
      title: 'VNOptimus',
      logo: { alt: 'VNOptimus', src: 'img/logo.svg' },
      items: [
        { to: '/start-here', label: 'Start Here', position: 'left' },
        { to: '/docs/pmi-acp/plan/week-1', label: 'Kế hoạch học', position: 'left' },
        { to: '/mock', label: 'Mock 50/120', position: 'left' },
        { to: '/blog', label: 'Blog', position: 'left' },
        { to: '/faq', label: 'FAQ', position: 'left' },
        { to: '/about', label: 'About', position: 'left' },
        { type: 'localeDropdown', position: 'right' },
        { href: 'https://github.com/lehoangduy1911/pmi-acp-site', label: 'GitHub', position: 'right' },
        { to: '/contact', label: 'Contact', position: 'left' },
      ],
    },
    announcementBar: {
      id: 'welcome',
      content:
        '🎉 Chào mừng đến VNOptimus — <a href="/start-here">Start Here</a>, <a href="/docs/pmi-acp/plan/week-1">Kế hoạch học</a>, hoặc xem <a href="/about">About</a>.',
      backgroundColor: '#eef2ff',
      textColor: '#111827',
      isCloseable: true,
    },
    colorMode: { respectPrefersColorScheme: true },
    footer: {
      style: 'dark',
      links: [
        { title: 'Docs', items: [{ label: 'Start Here', to: '/start-here' }] },
        {
          title: 'Học nhanh',
          items: [
            // Bạn có thể đổi sang 'Blueprint 2025' sau khi test redirect xong.
            { label: 'Module 01', to: '/docs/pmi-acp/module-01/lesson-01' },
            { label: 'Kế hoạch Tuần 1', to: '/docs/pmi-acp/plan/week-1' },
          ],
        },
        {
          title: 'More',
          items: [
            { label: 'About', to: '/about' },
            { label: 'Contact', to: '/contact' },
            { label: 'Blog', to: '/blog' },
            { label: 'GitHub', href: 'https://github.com/lehoangduy1911/pmi-acp-site' },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} VNOptimus`,
    },
    tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 },
    prism: { theme: prismThemes.github, darkTheme: prismThemes.dracula },
  } satisfies Preset.ThemeConfig,
};

export default config;
