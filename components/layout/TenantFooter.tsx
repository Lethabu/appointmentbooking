<<<<<<< HEAD
// Define the type for the theme object
interface TenantTheme {
  footer_html?: string;
}

interface TenantFooterProps {
  theme?: TenantTheme | null;
}

export default function TenantFooter({ theme }: TenantFooterProps) {
  if (!theme || !theme.footer_html) {
    // Render a default or fallback footer if no theme is provided
    return (
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>© 2025 Your Company - All rights reserved.</p>
      </footer>
    );
  }

  return (
    <footer className="bg-black text-white p-4 text-center">
      <div className="container mx-auto" dangerouslySetInnerHTML={{ __html: theme.footer_html }} />
=======

interface TenantFooterProps {
  brandName?: string;
  footerHtml?: string;
}

export function TenantFooter({ brandName, footerHtml }: TenantFooterProps) {
  return (
    <footer className="bg-gray-50 border-t py-6 mt-12">
      <div className="container mx-auto text-center text-gray-500">
        {footerHtml ? (
          <div dangerouslySetInnerHTML={{ __html: footerHtml }} />
        ) : (
          <p>&copy; {new Date().getFullYear()} {brandName || 'All Rights Reserved'}</p>
        )}
      </div>
>>>>>>> cf8a94a (feat: Implement full white-labeling for Instyle tenant)
    </footer>
  );
}
