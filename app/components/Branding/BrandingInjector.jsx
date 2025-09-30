import { headers } from 'next/headers';

const BrandingInjector = () => {
  const headersList = headers();
  const themeHeader = headersList.get('X-Tenant-Theme');

  if (!themeHeader) {
    return null;
  }

  try {
    const theme = JSON.parse(themeHeader);
    const cssVariables = Object.entries(theme)
      .map(([key, value]) => `--${key}: ${value};`)
      .join('\n');

    return (
      <style jsx global>{`
        :root {
          ${cssVariables}
        }
      `}</style>
    );
  } catch (error) {
    console.error('Failed to parse tenant theme:', error);
    return null;
  }
};

export default BrandingInjector;
