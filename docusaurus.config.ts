import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
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

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/lehoangduy1911/pmi-acp-site/tree/main/',
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
      },
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'VNOptimus',
      // logo: { alt: 'Logo', src: 'img/logo.svg' },
      items: [
        { to: '/docs/pmi-acp/start-here', label: 'PMI-ACP', position: 'left' },
        // search from local-search plugin auto-injected
        { type: 'localeDropdown', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [{ label: 'Bắt đầu', to: '/docs/pmi-acp/start-here' }],
        },
        {
          title: 'More',
          items: [
            { label: 'Blog', to: '/blog' },
            { label: 'GitHub', href: 'https://github.com/lehoangduy1911/pmi-acp-site' },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Duy Lê Hoàng`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
