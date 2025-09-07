import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'PMI-ACP Site',
  tagline: 'Dạy lại những gì đã học',
  favicon: 'img/favicon.ico',

  // Future flags
  future: { v4: true },

  // Set the production url of your site here
  url: 'https://your-project.vercel.app', // đổi thành domain của bạn khi deploy
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/',


  // Repo info (nếu dùng GitHub Pages)
  organizationName: 'your-username', // GitHub org/user
  projectName: 'pmi-acp-site',       // repo name

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
          // Nếu muốn nút "Edit this page", đổi đường link repo của bạn:
          editUrl: 'https://github.com/your-username/pmi-acp-site/tree/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: { type: ['rss', 'atom'], xslt: true },
          editUrl: 'https://github.com/your-username/pmi-acp-site/tree/main/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: { customCss: './src/css/custom.css' },
      } satisfies Preset.Options,
    ],
  ],

  // Local search plugin (khai báo như theme)
  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        language: ['vi', 'en'],
        // Một vài tuỳ chọn hay dùng:
        // indexDocs: true,
        // indexBlog: true,
        // highlightSearchTermsOnTargetPage: true,
      },
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'PMI-ACP Site',
      // logo: { alt: 'Logo', src: 'img/logo.svg' },
      items: [
        { to: '/docs/pmi-acp/start-here', label: 'PMI-ACP', position: 'left' },
        // Thanh tìm kiếm do theme local-search tự chèn (không cần {type:'search'})
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
            { label: 'GitHub', href: 'https://github.com/your-username/pmi-acp-site' },
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
