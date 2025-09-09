import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'VNOptimus',
  tagline: 'Dạy lại những gì đã học',
  favicon: 'img/favicon.ico',

  // Future flags
  future: { v4: true },

  // Production URL
  url: 'https://vnoptimus.vercel.app',
  baseUrl: '/',

  // Repo info
  organizationName: 'lehoangduy1911',   // GitHub user/org
  projectName: 'pmi-acp-site',          // repo name

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // i18n
  i18n: {
    defaultLocale: 'vi',
    locales: ['vi', 'en'],
    localeConfigs: {
      vi: { label: 'Tiếng Việt' },
      en: { label: 'English' },
    },
  },

  // Web fonts
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

        // ➕ Bật index đầy đủ
        indexDocs: true,
        indexBlog: true,
        indexPages: true,

        // ➕ Định base path rõ ràng
        docsRouteBasePath: '/docs',
        blogRouteBasePath: '/blog',

        // ➕ UX tìm kiếm
        highlightSearchTermsOnTargetPage: true, // tô sáng từ khoá trên trang đích
        explicitSearchResultPath: true,         // dùng route /search cho kết quả

        // (tuỳ chọn) giới hạn số kết quả hiển thị
        // searchResultLimits: 8,
      },
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',

    // Docs UX
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },

    navbar: {
      title: 'VNOptimus',
      logo: { alt: 'VNOptimus', src: 'img/logo.svg' },
      items: [
        { to: '/docs/pmi-acp/start-here', label: 'Bắt đầu học', position: 'left' },
        { to: '/docs/pmi-acp/plan/week-1', label: 'Kế hoạch học', position: 'left' },
        { to: '/blog', label: 'Blog', position: 'left' },

        // ➕ About
        { to: '/about', label: 'About', position: 'left' },

        // search from local-search plugin is auto-injected
        { type: 'localeDropdown', position: 'right' },
        { href: 'https://github.com/lehoangduy1911/pmi-acp-site', label: 'GitHub', position: 'right' },

        // NOTE: Bạn đang có cả '/docs/.../start-here' và '/start-here'.
        // Nên giữ 1 trong 2 để tránh trùng UX. Tạm thời vẫn giữ như cũ:
        { to: '/start-here', label: 'Start Here', position: 'left' },
        { to: '/faq', label: 'FAQ', position: 'left' },
        { to: '/contact', label: 'Contact', position: 'left' },
      ],
    },

    announcementBar: {
      id: 'welcome',
      content:
        '🎉 Chào mừng đến VNOptimus — <a href="/docs/pmi-acp/start-here">Bắt đầu học</a>, <a href="/docs/pmi-acp/plan/week-1">Kế hoạch học</a>, hoặc xem <a href="/about">About</a>.',
      backgroundColor: '#eef2ff',
      textColor: '#111827',
      isCloseable: true,
    },

    colorMode: { respectPrefersColorScheme: true },

    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Bắt đầu', to: '/docs/pmi-acp/start-here' },
          ],
        },
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

    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
