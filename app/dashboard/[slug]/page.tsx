'use client';


import { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, TrendingUp, DollarSign, Clock, Star } from 'lucide-react';
import Link from 'next/link';

export default function TenantDashboard({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string>('');
  
  useEffect(() => {
    params.then(p => setSlug(p.slug));
  }, [params]);
  const tenant = useQuery(api.tenants.getBySlug, slug ? { slug } : 'skip');
  const services = useQuery(api.services.list, tenant?._id ? { tenantId: tenant._id } : 'skip');
  const bookings = useQuery(api.bookings.list, tenant?._id ? { tenantId: tenant._id } : 'skip');

  if (!tenant) {
    return <div className="p-8">Loading...</div>;
  }

  const stats = {
    totalBookings: bookings?.length || 0,
    totalRevenue: bookings?.reduce((sum, booking) => sum + booking.amount, 0) || 0,
    avgRating: tenant.rating || 4.9,
    totalServices: services?.length || 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{tenant.name}</h1>
              <p className="text-gray-600">Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={tenant.tier === 'pro' ? 'default' : 'secondary'}>
                {tenant.tier?.toUpperCase()} Plan
              </Badge>
              <Link href={`/salons/${tenant.slug}`}>
                <Button variant="outline">View Public Page</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R{stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +25% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgRating}/5</div>
              <p className="text-xs text-muted-foreground">
                Based on {tenant.reviewCount || 100} reviews
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Services</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalServices}</div>
              <p className="text-xs text-muted-foreground">
                Active services
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your salon efficiently</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href={`/dashboard/${tenant.slug}/services`}>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Services
                </Button>
              </Link>
              <Link href={`/dashboard/${tenant.slug}/bookings`}>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  View Bookings
                </Button>
              </Link>
              <Link href={`/dashboard/${tenant.slug}/settings`}>
                <Button className="w-full justify-start" variant="outline">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Latest appointments</CardDescription>
            </CardHeader>
            <CardContent>
              {bookings?.slice(0, 5).map((booking) => (
                <div key={booking._id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">Booking #{booking._id.slice(-6)}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(booking.start).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={booking.status === 'completed' ? 'default' : 'secondary'}>
                    {booking.status}
                  </Badge>
                </div>
              )) || (
                <p className="text-gray-500 text-center py-4">No bookings yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Upgrade CTA for free tier */}
        {tenant.tier === 'starter' && (
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-purple-800">Upgrade to Pro</CardTitle>
              <CardDescription className="text-purple-600">
                Unlock advanced features and grow your salon business
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-purple-700 mb-2">Get access to:</p>
                  <ul className="text-sm text-purple-600 space-y-1">
                    <li>• Unlimited bookings</li>
                    <li>• Advanced analytics</li>
                    <li>• Custom branding</li>
                    <li>• Priority support</li>
                  </ul>
                </div>
                <Link href="/pricing">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Upgrade Now
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}