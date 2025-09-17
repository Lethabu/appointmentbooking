'use client';

import {
  Calendar,
  Users,
  Scissors,
  Package,
  MessageSquare,
  Settings,
  Home,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';

const menuItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'Appointments',
    url: '/dashboard/appointments',
    icon: Calendar,
  },
  {
    title: 'Clients',
    url: '/dashboard/clients',
    icon: Users,
  },
  {
    title: 'Services',
    url: '/dashboard/services',
    icon: Scissors,
  },
  {
    title: 'Products',
    url: '/dashboard/products',
    icon: Package,
  },
  {
    title: 'Marketing (AI)',
    url: '/dashboard/marketing',
    icon: MessageSquare,
  },
  {
    title: 'Settings',
    url: '/dashboard/settings',
    icon: Settings,
  },
];

export function DashboardSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Scissors className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Instyle</h2>
            <p className="text-xs text-gray-500">Hair Boutique</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="text-xs text-gray-500">
          <p>Instyle Hair Boutique</p>
          <p>Dashboard v2.0</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
