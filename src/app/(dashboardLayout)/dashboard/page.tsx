import Stats from '@/components/modules/dashboard/stats';
import statsService from '@/services/stats.service';
import { userService } from '@/services/user.service';
import restaurantService from '@/services/restaurant.service';
import { PopularMeals, RecentRestaurants, NewUsers } from '@/components/modules/dashboard/DashboardLists';
import { LayoutDashboard, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import AnalyticsCharts from '@/components/modules/dashboard/analytics/AnalyticsCharts';



const Dashboard = async () => {
  const session = await userService.getUserSession();

  if (!session) return null;

  const stats = await statsService.getStats();
  const statsData = stats?.data;

  // Fetch additional data for the dashboard
  const restaurantsRes = session?.user?.role === 'admin' ? await restaurantService.getAllRestaurants() : null;
  const usersRes = session?.user?.role === 'admin' ? await userService.getAllUsers() : null;

  const restaurants = restaurantsRes?.data || [];
  const users = usersRes?.data || [];
  const topMeals = statsData?.topMeals || [];

  return (
    <div className="p-6 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm tracking-wider uppercase">
            <Sparkles className="w-4 h-4 fill-primary/20" />
            Overview Dashboard
          </div>
          <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Welcome back, {session?.user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium text-lg">
            Here is what is happening with your restaurant today.
          </p>
        </div>
      </header>

      {/* Existing Stats */}
      <Stats session={session} statsData={statsData} />

      {/* Analytics Preview */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1.5 bg-primary rounded-full"></div>
          <h2 className="text-2xl font-black text-zinc-800 dark:text-zinc-200 tracking-tight">Activity Overview</h2>
        </div>
        <AnalyticsCharts statsData={statsData} />
      </section>

      {/* New Dashboard Sections */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PopularMeals meals={topMeals} />
        
        {session?.user?.role === 'admin' && (
          <>
            <RecentRestaurants restaurants={restaurants} />
            <NewUsers users={users} />
          </>
        )}
        
        {session?.user?.role !== 'admin' && (
          <div className="col-span-1 lg:col-span-2">
             <Card className="border-none bg-primary/5 p-8 flex flex-col items-center justify-center text-center space-y-4 h-full min-h-[350px] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                  <LayoutDashboard className="w-32 h-32 text-primary" />
                </div>
                <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center shadow-inner">
                  <LayoutDashboard className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-black tracking-tight">More Insights Coming Soon</h3>
                <p className="text-muted-foreground max-w-sm text-lg font-medium leading-relaxed">
                  We are working on bringing more detailed restaurant-specific analytics to your dashboard. Stay tuned!
                </p>
             </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
