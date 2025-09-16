import React from 'react';
import OriginalFooter from '@theme-original/DocItem/Footer';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import Subscribe from '@site/src/components/Subscribe';

export default function DocItemFooterWrapper(props) {
  const { metadata } = useDoc(); // v3: lấy từ plugin-content-docs
  const source = `docs:${metadata?.unversionedId ?? metadata?.id ?? 'unknown'}`;

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
