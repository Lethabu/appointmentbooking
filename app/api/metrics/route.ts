import { NextResponse } from 'next/server';

export async function GET() {
  const metrics = {
    timestamp: new Date().toISOString(),
    commerce: {
      totalRevenue: 125000, // R1,250
      totalOrders: 47,
      avgOrderValue: 26595,
      conversionRate: 3.2,
<<<<<<< HEAD
      cartAbandonmentRate: 68.5,
=======
      cartAbandonmentRate: 68.5
>>>>>>> origin/feat/instyle-whitelabel
    },
    performance: {
      pageLoadTime: 1.2,
      apiResponseTime: 0.3,
      uptime: 99.9,
<<<<<<< HEAD
      errorRate: 0.1,
=======
      errorRate: 0.1
>>>>>>> origin/feat/instyle-whitelabel
    },
    ai: {
      chatbotInteractions: 234,
      resolutionRate: 87.3,
      avgResponseTime: 2.1,
<<<<<<< HEAD
      customerSatisfaction: 4.6,
=======
      customerSatisfaction: 4.6
>>>>>>> origin/feat/instyle-whitelabel
    },
    social: {
      instagramFollowers: 1250,
      tiktokViews: 15600,
      whatsappMessages: 89,
<<<<<<< HEAD
      socialConversions: 12,
    },
  };

  return NextResponse.json(metrics);
}
=======
      socialConversions: 12
    }
  };

  return NextResponse.json(metrics);
}
>>>>>>> origin/feat/instyle-whitelabel
