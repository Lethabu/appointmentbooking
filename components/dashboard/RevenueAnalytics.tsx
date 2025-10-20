'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const mockData = {
  totalRevenue: 185000, // R1,850
  serviceRevenue: 125000, // R1,250
  productRevenue: 60000, // R600
  topServices: [
    { name: 'Maphondo & Lines', bookings: 8, revenue: 48000 },
    { name: 'Middle & Side', bookings: 12, revenue: 54000 },
    { name: 'Hair Treatment', bookings: 9, revenue: 22500 },
  ],
  topProducts: [
    { name: 'Hair Extensions', sales: 4, revenue: 18000 },
    { name: 'Treatment Kit', sales: 6, revenue: 15000 },
    { name: 'Styling Bundle', sales: 8, revenue: 14400 },
  ],
};

export default function RevenueAnalytics() {
  const formatPrice = (cents: number) => `R${(cents / 100).toFixed(0)}`;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Revenue Analytics</h2>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatPrice(mockData.totalRevenue)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Service Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatPrice(mockData.serviceRevenue)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Product Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {formatPrice(mockData.productRevenue)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockData.topServices.map((service, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <Badge variant="outline">{service.bookings} bookings</Badge>
                  </div>
                  <p className="font-bold">{formatPrice(service.revenue)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockData.topProducts.map((product, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <Badge variant="outline">{product.sales} sales</Badge>
                  </div>
                  <p className="font-bold">{formatPrice(product.revenue)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}