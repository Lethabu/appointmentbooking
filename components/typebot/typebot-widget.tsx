'use client';

import { useEffect } from 'react';

interface TypebotWidgetProps {
  typebotId: string;
  tenantId: string;
  theme?: {
    button?: { backgroundColor: string };
  };
}

export function TypebotWidget({
  typebotId,
  tenantId,
  theme,
}: TypebotWidgetProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.innerHTML = `
      import Typebot from 'https://cdn.jsdelivr.net/npm/@typebot.io/js@0.3/dist/web.js'
      
      Typebot.initBubble({
        typebot: "${typebotId}",
        theme: ${JSON.stringify(theme || { button: { backgroundColor: '#6366f1' } })},
        prefilledVariables: {
          tenantId: "${tenantId}",
          webhookUrl: "${process.env.NEXT_PUBLIC_APP_URL || 'https://your-platform-domain.com'}"
        }
      })
    `;

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [typebotId, tenantId, theme]);

  return <div id="typebot-container" className="fixed bottom-4 right-4 z-50" />;
}

export function TypebotEmbed({
  typebotId,
  tenantId,
  className = '',
}: TypebotWidgetProps & { className?: string }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.innerHTML = `
      import Typebot from 'https://cdn.jsdelivr.net/npm/@typebot.io/js@0.3/dist/web.js'
      
      Typebot.initStandard({
        typebot: "${typebotId}",
        prefilledVariables: {
          tenantId: "${tenantId}",
          webhookUrl: "${process.env.NEXT_PUBLIC_APP_URL || 'https://your-platform-domain.com'}"
        }
      })
    `;

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [typebotId, tenantId]);

  return <div id="typebot-standard" className={`w-full h-96 ${className}`} />;
}
