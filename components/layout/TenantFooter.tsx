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
    </footer>
  );
}
