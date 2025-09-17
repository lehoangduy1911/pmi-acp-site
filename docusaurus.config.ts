import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

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

  onBrokenLinks: 'ignore',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'vi',
    locales: ['vi', 'en'],
    localeConfigs: {
      vi: { label: 'Tiếng Việt' },
      en: { label: 'English' },
    },
  },

  stylesheets: [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600&display=swap',
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: 'docs',
          sidebarPath: require.resolve('./sidebars.ts'),
          editUrl: 'https://github.com/lehoangduy1911/pmi-acp-site/tree/main/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          numberPrefixParser: true,
        },
        blog: {
          showReadingTime: true,
          feedOptions: { type: ['rss', 'atom'], xslt: true },
          editUrl: 'https://github.com/lehoangduy1911/pmi-acp-site/tree/main/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: { customCss: require.resolve('./src/css/custom.css') },
      } satisfies Preset.Options,
    ],
  ],

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

        // tránh crash do phím tắt
        searchBarShortcut: false,
        searchBarShortcutHint: false,

        // 👇 Loại các trang tổng quan cũ khỏi chỉ mục tìm kiếm
        ignoreFiles: [
          'docs/pmi-acp/domains/domain-mindset.mdx',
          'docs/pmi-acp/domains/domain-delivery.mdx',
          'docs/pmi-acp/domains/domain-leadership.mdx',
          'docs/pmi-acp/domains/domain-product.mdx',
        ],
      },
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          // giữ các redirect hiện có
          { from: '/docs/pmi-acp/module-01/lesson-01', to: '/docs/pmi-acp/domains/mindset' },
          { from: '/pmi-acp/module-01/lesson-01', to: '/docs/pmi-acp/domains/mindset' },
          { from: '/docs/pmi-acp/module-01/lesson-02', to: '/docs/pmi-acp/domains/delivery' },
          { from: '/pmi-acp/module-01/lesson-02', to: '/docs/pmi-acp/domains/delivery' },

          // 👇 chuyển các URL domain-*.mdx cũ sang slug domain mới
          { from: '/docs/pmi-acp/domains/domain-mindset', to: '/docs/pmi-acp/domains/mindset' },
          { from: '/docs/pmi-acp/domains/domain-leadership', to: '/docs/pmi-acp/domains/leadership' },
          { from: '/docs/pmi-acp/domains/domain-product', to: '/docs/pmi-acp/domains/product' },
          { from: '/docs/pmi-acp/domains/domain-delivery', to: '/docs/pmi-acp/domains/delivery' },
        ],
      },
    ],
  ],

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
        { to: '/docs/pmi-acp/blueprint-2025', label: 'Blueprint 2025', position: 'left' },
        { to: '/mock', label: 'Luyện đề', position: 'left' },
        { to: '/blog', label: 'Blog', position: 'left' },

        // 👇 vẫn khai báo i18n nhưng ẩn bằng CSS
        { type: 'localeDropdown', position: 'right', className: 'localeToggleHidden' },

        { type: 'search', position: 'right' },
        {
          type: 'dropdown',
          label: 'More',
          position: 'right',
          items: [
            { to: '/faq', label: 'FAQ' },
            { to: '/about', label: 'About' },
            { to: '/contact', label: 'Contact' },
            { href: 'https://github.com/lehoangduy1911/pmi-acp-site', label: 'GitHub' },
          ],
        },
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
