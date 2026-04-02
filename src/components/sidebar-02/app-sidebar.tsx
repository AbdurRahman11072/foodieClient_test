'use client';

import { Logo } from '@/components/sidebar-02/logo';
import DashboardNavigation from '@/components/sidebar-02/nav-main';
import { NotificationsPopover } from '@/components/sidebar-02/nav-notifications';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  Home,
  LinkIcon,
  Package2,
  PieChart,
  Settings,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import type { Route } from './nav-main';

const sampleNotifications = [
  {
    id: '1',
    avatar: '/avatars/01.png',
    fallback: 'OM',
    text: 'New order received.',
    time: '10m ago',
  },
  {
    id: '2',
    avatar: '/avatars/02.png',
    fallback: 'JL',
    text: 'Server upgrade completed.',
    time: '1h ago',
  },
  {
    id: '3',
    avatar: '/avatars/03.png',
    fallback: 'HH',
    text: 'New user signed up.',
    time: '2h ago',
  },
];

const dashboardRoutes: Route[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: <Home className="size-4" />,
    link: '/dashboard',
  },
  {
    id: 'products',
    title: 'Products',
    icon: <Package2 className="size-4" />,
    link: '#',
    subs: [
      {
        title: 'All Products',
        link: '/dashboard/all-products',
        icon: <Package2 className="size-4" />,
      },
      {
        title: 'Add Products',
        link: '/dashboard/add-products',
        icon: <LinkIcon className="size-4" />,
      },
    ],
  },
  {
    id: 'manage-user',
    title: 'Manage User',
    icon: <PieChart className="size-4" />,
    link: '/dashboard/manage-user',
  },
  {
    id: 'manage-catagroy',
    title: 'Manage Catagory',
    icon: <Sparkles className="size-4" />,
    link: '/dashboard/manage-catagroy',
  },
  {
    id: 'manage-restaurants',
    title: 'Manage Restaurants',
    icon: <ShoppingBag className="size-4" />,
    link: '/dashboard/manage-restaurants',
  },

  {
    id: 'settings',
    title: 'Settings',
    icon: <Settings className="size-4" />,
    link: '#',
    subs: [
      { title: 'General', link: '#' },
      { title: 'Webhooks', link: '#' },
      { title: 'Custom Fields', link: '#' },
    ],
  },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader
        className={cn(
          'flex md:pt-3.5',
          isCollapsed
            ? 'flex-row items-center justify-between gap-y-4 md:flex-col md:items-start md:justify-start'
            : 'flex-row items-center justify-between'
        )}
      >
        <a href="#" className="flex items-center gap-2">
          <Logo className="h-8 w-8" />
          {!isCollapsed && (
            <span className="font-semibold text-black dark:text-white">
              Acme
            </span>
          )}
        </a>

        <motion.div
          key={isCollapsed ? 'header-collapsed' : 'header-expanded'}
          className={cn(
            'flex items-center gap-2',
            isCollapsed ? 'flex-row md:flex-col-reverse' : 'flex-row'
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <NotificationsPopover notifications={sampleNotifications} />
          <SidebarTrigger />
        </motion.div>
      </SidebarHeader>
      <SidebarContent className="gap-4 px-2 py-4">
        <DashboardNavigation routes={dashboardRoutes} />
      </SidebarContent>
      <SidebarFooter className="px-2"></SidebarFooter>
    </Sidebar>
  );
}
