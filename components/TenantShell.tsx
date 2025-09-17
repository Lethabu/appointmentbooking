import useSWR from 'swr';
import { ReactNode } from 'react';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function TenantShell({
  children,
  tokens,
}: {
  children: ReactNode;
  tokens: any;
}) {
  const { data, error } = useSWR('/api/render-component', fetcher);

  if (error) return <div>Failed to load tenant components</div>;
  if (!data) return <div>Loading...</div>;

  const { header, footer } = data;

  // Convert tokens to CSS variables
  const tokenCss = Object.entries(tokens || {})
    .map(([key, value]) => {
      return `--${key}: ${value};`;
    })
    .join('\n');

  return (
    <>
      <style>{tokenCss}</style>
      {header && (
        <>
          <style>{header.css}</style>
          <div dangerouslySetInnerHTML={{ __html: header.html_chunk ?? '' }} />
        </>
      )}
      <main>{children}</main>
      {footer && (
        <>
          <style>{footer.css}</style>
          <div dangerouslySetInnerHTML={{ __html: footer.html_chunk ?? '' }} />
        </>
      )}
    </>
  );
}
