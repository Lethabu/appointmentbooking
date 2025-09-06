'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const mockData = {
  totalRevenue: 125000, // R1,250
  totalOrders: 47,
  avgOrderValue: 26595, // R265.95
  topProducts: [
    { name: 'Hair Extensions', sales: 15, revenue: 67500 },
    { name: 'Treatment Kit', sales: 12, revenue: 30000 },
    { name: 'Styling Bundle', sales: 8, revenue: 14400 }
  ],
  recentOrders: [
    { id: 'ORD001', customer: 'Sarah M.', amount: 45000, status: 'completed' },
    { id: 'ORD002', customer: 'Thandi K.', amount: 25000, status: 'processing' },
    { id: 'ORD003', customer: 'Lisa P.', amount: 18000, status: 'completed' }
  ]
};

export default function EcommerceDashboard() {
  const formatPrice = (cents: number) => `R${(cents / 100).toFixed(0)}`;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">E-Commerce Dashboard</h2>
      
      {/* KPI Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatPrice(mockData.totalRevenue)}
            </div>
            <p className="text-xs text-gray-500">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {mockData.totalOrders}
            </div>
            <p className="text-xs text-gray-500">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatPrice(mockData.avgOrderValue)}
            </div>
            <p className="text-xs text-gray-500">+5% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.topProducts.map((product, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sales} sales</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatPrice(product.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-gray-500">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatPrice(order.amount)}</p>
                    <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}