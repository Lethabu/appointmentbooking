'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingCart, 
  MessageCircle, 
  TrendingUp, 
  Users, 
  Instagram, 
  Smartphone,
  DollarSign,
  Package,
  Clock,
  AlertCircle
} from 'lucide-react';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalBookings: number;
  whatsappSessions: number;
  abandonedCarts: number;
  socialClicks: number;
  conversionRate: number;
  avgOrderValue: number;
}

interface RecentActivity {
  id: string;
  type: 'order' | 'booking' | 'whatsapp' | 'social_click';
  description: string;
  amount?: number;
  timestamp: string;
  customer: string;
}

export default function EcommerceDashboard({ tenantId }: { tenantId: string }) {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalBookings: 0,
    whatsappSessions: 0,
    abandonedCarts: 0,
    socialClicks: 0,
    conversionRate: 0,
    avgOrderValue: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [statsRes, activityRes] = await Promise.all([
        fetch(`/api/dashboard-stats?tenantId=${tenantId}`),
        fetch(`/api/dashboard/recent-activity?tenantId=${tenantId}`)
      ]);

      const statsData = await statsRes.json();
      const activityData = await activityRes.json();

      setStats(statsData);
      setRecentActivity(activityData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const syncWhatsAppCatalog = async () => {
    try {
      const response = await fetch('/api/whatsapp/catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, action: 'sync' })
      });
      
      const result = await response.json();
      if (result.success) {
        alert(`Catalog synced! ${result.products_synced} products updated.`);
      }
    } catch (error) {
      console.error('Catalog sync failed:', error);
      alert('Catalog sync failed. Please try again.');
    }
  };

  const runAbandonedCartRecovery = async () => {
    try {
      const response = await fetch('/api/conversational-commerce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'abandoned_cart_recovery',
          tenantId 
        })
      });
      
      const result = await response.json();
      if (result.success) {
        alert(`Recovery messages sent to ${result.abandoned_carts_processed} customers.`);
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error('Cart recovery failed:', error);
    }
  };

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">InStyle Commerce Dashboard</h1>
          <p className="text-gray-600">Real-time business insights and automation</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={syncWhatsAppCatalog} variant="outline">
            <MessageCircle className="w-4 h-4 mr-2" />
            Sync WhatsApp Catalog
          </Button>
          <Button onClick={runAbandonedCartRecovery} variant="outline">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Run Cart Recovery
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R{(stats.totalRevenue / 100).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Avg order: R{(stats.avgOrderValue / 100).toFixed(0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders + Bookings</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders + stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalOrders} orders, {stats.totalBookings} bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">WhatsApp Sessions</CardTitle>
            <MessageCircle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.whatsappSessions}</div>
            <p className="text-sm text-muted-foreground">
              {stats.socialClicks} social clicks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.abandonedCarts} abandoned carts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp Commerce</TabsTrigger>
          <TabsTrigger value="social">Social Commerce</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {activity.type === 'order' && <ShoppingCart className="w-4 h-4 text-green-600" />}
                        {activity.type === 'booking' && <Clock className="w-4 h-4 text-blue-600" />}
                        {activity.type === 'whatsapp' && <MessageCircle className="w-4 h-4 text-green-600" />}
                        {activity.type === 'social_click' && <Instagram className="w-4 h-4 text-purple-600" />}
                        <div>
                          <p className="text-sm font-medium">{activity.description}</p>
                          <p className="text-xs text-gray-500">{activity.customer}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {activity.amount && (
                          <p className="text-sm font-medium">R{(activity.amount / 100).toFixed(0)}</p>
                        )}
                        <p className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Package className="w-4 h-4 mr-2" />
                  Add New Product
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Broadcast Message
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Instagram className="w-4 h-4 mr-2" />
                  Create Instagram Story
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Analytics Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="whatsapp" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Catalog Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="secondary">Active</Badge>
                  <p className="text-sm text-gray-600">Last synced: 2 hours ago</p>
                  <p className="text-sm text-gray-600">Products: 12</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Chats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.whatsappSessions}</div>
                <p className="text-sm text-gray-600">Customers in conversation</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cart Recovery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{stats.abandonedCarts}</div>
                  <p className="text-sm text-gray-600">Abandoned carts</p>
                  <Button size="sm" onClick={runAbandonedCartRecovery}>
                    Send Recovery Messages
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <Instagram className="w-4 h-4 mr-2" />
                      Instagram
                    </span>
                    <Badge>{stats.socialClicks} clicks</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <Smartphone className="w-4 h-4 mr-2" />
                      TikTok
                    </span>
                    <Badge>Coming Soon</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">• Showcase new wig installation</p>
                  <p className="text-sm">• Before/after transformation</p>
                  <p className="text-sm">• Hair care tips video</p>
                  <p className="text-sm">• Customer testimonial story</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Workflows</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Abandoned Cart Recovery</span>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Post-Installation Upsell</span>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Booking Reminders</span>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Automation Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">Messages sent today: 24</p>
                  <p className="text-sm">Recovery rate: 15%</p>
                  <p className="text-sm">Upsell conversion: 8%</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
