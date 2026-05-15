'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CHART_COLORS = [
  'oklch(0.81 0.1 252)',
  'oklch(0.62 0.19 260)',
  'oklch(0.55 0.22 263)',
  'oklch(0.49 0.22 264)',
  'oklch(0.42 0.18 266)',
];

interface AnalyticsChartsProps {
  statsData: any;
}

const CustomTooltip = ({ active, payload, label, prefix = '' }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-border p-3 rounded-xl shadow-xl">
        <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase">{label}</p>
        <p className="text-sm font-bold text-foreground">
          {prefix}{payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const AnalyticsCharts = ({ statsData }: AnalyticsChartsProps) => {
  if (!statsData) return <div>No data available</div>;

  // Format Revenue Data
  const formattedRevenue = statsData.revenueData?.reduce((acc: any[], item: any) => {
    const date = new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit' }).format(new Date(item.createdAt));
    const existing = acc.find((d) => d.date === date);
    if (existing) {
      existing.revenue += item.totalPrice;
    } else {
      acc.push({ date, revenue: item.totalPrice });
    }
    return acc;
  }, []).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [];

  // Format Top Meals
  const formattedMeals = statsData.topMeals?.map((item: any) => ({
    name: item.mealName,
    orders: item._count.mealId,
  })) || [];

  // Format Order Status
  const formattedStatus = statsData.orderStatusDistribution?.map((item: any) => ({
    name: item.status,
    value: item._count.status,
  })) || [];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 mt-6">
      {/* Revenue Trend */}
      <Card className="col-span-1 lg:col-span-2 border-none bg-white/50 backdrop-blur-md dark:bg-zinc-900/50 shadow-sm overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg font-bold">Revenue Trend (Last 7 Days)</CardTitle>
          <p className="text-sm text-muted-foreground">Daily earnings performance</p>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={formattedRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
                />
                <Tooltip content={<CustomTooltip prefix="$" />} />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="var(--primary)" 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  strokeWidth={4}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Meals Bar Chart */}
      <Card className="border-none bg-white/50 backdrop-blur-md dark:bg-zinc-900/50 shadow-sm overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg font-bold">Top Performing Meals</CardTitle>
          <p className="text-sm text-muted-foreground">Most ordered items</p>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formattedMeals} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--primary)', opacity: 0.05 }} />
                <Bar dataKey="orders" fill="var(--primary)" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Order Status Distribution */}
      <Card className="border-none bg-white/50 backdrop-blur-md dark:bg-zinc-900/50 shadow-sm overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg font-bold">Order Status Distribution</CardTitle>
          <p className="text-sm text-muted-foreground">Overview of order fulfillment</p>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formattedStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {formattedStatus.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle" 
                  formatter={(value) => <span className="text-xs font-medium text-muted-foreground">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsCharts;
