import React from 'react';
import statsService from '@/services/stats.service';
import { userService } from '@/services/user.service';
import Stats from '@/components/modules/dashboard/stats';
import AnalyticsCharts from '@/components/modules/dashboard/analytics/AnalyticsCharts';
import { TrendingUp } from 'lucide-react';



const AnalyticsPage = async () => {
  const session = await userService.getUserSession();
  
  if (!session) return null;
  
  const stats = await statsService.getStats();
  const statsData = stats?.data;

  return (
    <div className="p-6 space-y-10 min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm tracking-wider uppercase">
            <TrendingUp className="w-4 h-4" />
            Performance Insights
          </div>
          <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Analytics Overview
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl text-lg font-medium">
            Deep dive into your restaurant's performance metrics and customer trends.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold border border-primary/20">
            Last 30 Days
          </div>
        </div>
      </header>

      <section className="space-y-6">
         <Stats session={session} statsData={statsData} />
      </section>

      {/* Visual Analytics */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1.5 bg-primary rounded-full"></div>
          <h2 className="text-2xl font-black text-zinc-800 dark:text-zinc-200 tracking-tight">Visual Insights</h2>
        </div>
        <AnalyticsCharts statsData={statsData} />
      </section>
    </div>
  );
};

export default AnalyticsPage;
