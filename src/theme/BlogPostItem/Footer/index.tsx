import React from 'react';
import OriginalFooter from '@theme-original/BlogPostItem/Footer';
import { useBlogPost } from '@docusaurus/plugin-content-blog/client';
import Subscribe from '@site/src/components/Subscribe';

export default function BlogPostItemFooterWrapper(props) {
  const { metadata } = useBlogPost(); // v3: lấy từ plugin-content-blog
  const source = `blog:${metadata?.slug ?? metadata?.permalink ?? 'unknown'}`;

  return (
    <>
      <OriginalFooter {...props} />
      <section style={{ marginTop: 32 }}>
        <h3>Liên hệ &amp; cập nhật</h3>
        <Subscribe source={source} />
      </section>
    </>
  );
}
