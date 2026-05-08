'use client';

import { Card, CardContent } from '@/components/ui/card';
import { SessionData } from '@/types/session';
import { 
  Utensils, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  Users, 
  UserCheck 
} from 'lucide-react';

type stats = {
  totalMeal?: number;
  totalOrder?: number;
  totalEarning?: number;
  totalUser?: number;
  activeUser?: number;
  revenueData?: any[];
  topMeals?: any[];
  orderStatusDistribution?: any[];
};

type statsType = {
  session: SessionData | null;
  statsData: stats;
};

export default function Stats({ session, statsData }: statsType) {
  const total7dRevenue = statsData.revenueData?.reduce((sum, o) => sum + o.totalPrice, 0) || 0;

  let data = [
    {
      name: 'Total Meals',
      stat: statsData.totalMeal,
      icon: Utensils,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
    },
    {
      name: 'Total Orders',
      stat: statsData.totalOrder,
      icon: ShoppingBag,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      name: 'Total Earnings',
      stat: `$${statsData.totalEarning?.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
    },
    {
      name: 'Revenue (7d)',
      stat: `$${total7dRevenue.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
  ];

  if (session?.user?.role === 'admin') {
    data = [
      {
        name: 'Total Users',
        stat: statsData.totalUser,
        icon: Users,
        color: 'text-purple-500',
        bg: 'bg-purple-500/10',
      },
      {
        name: 'Active Users',
        stat: statsData.activeUser,
        icon: UserCheck,
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10',
      },
      {
        name: 'Total Orders',
        stat: statsData.totalOrder,
        icon: ShoppingBag,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
      },
      {
        name: 'Total Earnings',
        stat: `$${statsData.totalEarning?.toLocaleString()}`,
        icon: DollarSign,
        color: 'text-green-500',
        bg: 'bg-green-500/10',
      },
    ];
  }

  return (
    <div className="w-full">
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
        {data.map((item) => (
          <Card 
            key={item.name} 
            className="overflow-hidden border-none bg-white/50 backdrop-blur-md dark:bg-zinc-900/50 shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    {item.name}
                  </dt>
                  <dd className="mt-1 flex items-baseline">
                    <span className="tabular-nums text-2xl font-bold text-foreground">
                      {item.stat}
                    </span>
                  </dd>
                </div>
                <div className={`p-3 rounded-2xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-muted-foreground">
                <span className="flex items-center text-emerald-500 font-medium mr-2">
                  +12.5%
                </span>
                <span>from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </dl>
    </div>
  );
}
