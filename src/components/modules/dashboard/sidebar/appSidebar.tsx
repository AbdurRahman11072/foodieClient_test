'use client';

import {
  BarChart3,
  ChevronDown,
  ClipboardList,
  DollarSign,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Sparkles,
  Store,
  Users,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { SessionData } from '@/types/session';

export function AppSidebar({ session }: { session: SessionData | null }) {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    products: false,
    billing: false,
    sales: false,
    finance: false,
    settings: false,
  });

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  let menuItems = [
    {
      title: 'Dashbaord',
      icon: LayoutDashboard,
      href: '/dashboard',
    },
    {
      title: 'Meals',
      icon: Package,
      href: '#',
      submenu: [
        { title: 'All Meals', href: '/dashboard/meals' },
        { title: 'New Meals', href: '#' },
        { title: 'Add Meals', href: '/dashboard/add-meals' },
      ],
      key: 'meals',
    },
    {
      title: 'Sales',
      icon: ShoppingCart,
      href: '/dashboard/sales',
      submenu: [
        { title: 'Orders', href: '#' },
        { title: 'Reports', href: '#' },
      ],
      key: 'sales',
    },
    {
      title: 'Analytics',
      icon: BarChart3,
      href: '/dashboard/analytics',
    },

    {
      title: 'Settings',
      icon: Settings,
      href: '#',
      submenu: [
        { title: 'General', href: '#' },
        { title: 'Security', href: '#' },
      ],
      key: 'settings',
    },
  ];
  if (session?.user?.role === 'admin') {
    menuItems = [
      {
        title: 'Dashbaord',
        icon: LayoutDashboard,
        href: '/dashboard',
      },
      {
        title: 'Users',
        icon: Users,
        href: '/dashboard/users',
      },
      {
        title: 'Stores',
        icon: Store,
        href: '/dashboard/stores',
      },
      {
        title: 'Meals',
        icon: Package,
        href: '#',
        submenu: [
          { title: 'All Meals', href: '/dashboard/meals' },
          { title: 'New Meals', href: '/dashboard/new-meals' },
        ],
        key: 'meals',
      },
      {
        title: 'Sales',
        icon: ShoppingCart,
        href: '/dashboard/sales',
        submenu: [
          { title: 'Orders', href: '#' },
          { title: 'Reports', href: '#' },
        ],
        key: 'sales',
      },
      {
        title: 'Catagory',
        icon: ClipboardList,
        href: '#',
        submenu: [
          { title: 'All Products', href: '/dashboard/category' },

          { title: 'Add Products', href: '/dashboard/add-products' },
        ],
        key: 'catagory',
      },

      {
        title: 'Analytics',
        icon: BarChart3,
        href: '/dashboard/analytics',
      },
      {
        title: 'Finance',
        icon: DollarSign,
        href: '/dashboard/finance',
        submenu: [
          { title: 'Accounts', href: '#' },
          { title: 'Transactions', href: '#' },
        ],
        key: 'finance',
      },

      {
        title: 'Settings',
        icon: Settings,
        href: '#',
        submenu: [
          { title: 'General', href: '#' },
          { title: 'Security', href: '#' },
        ],
        key: 'settings',
      },
    ];
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="font-semibold text-foreground">Foodie</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => item.key && toggleMenu(item.key)}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                    <ChevronDown
                      className={`ml-auto h-4 w-4 transition-transform ${
                        openMenus[item.key || ''] ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openMenus[item.key || ''] && (
                    <SidebarMenuSub>
                      {item.submenu.map((subitem) => (
                        <SidebarMenuSubItem key={subitem.title}>
                          <SidebarMenuSubButton asChild>
                            <a href={subitem.href}>{subitem.title}</a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </div>
              ) : (
                <SidebarMenuButton asChild>
                  <a href={item.href} className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-200">
            <span className="text-xs font-semibold">A</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Alpha Inc.</p>
            <p className="text-xs text-sidebar-foreground/60">Free</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
