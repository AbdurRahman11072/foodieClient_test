import Stats from '@/components/modules/dashboard/stats';
import statsService from '@/services/stats.service';
import { userSerivce } from '@/services/user.service';

const Dashboard = async () => {
  const session = await userSerivce.getUserSession();
  const stats = await statsService.getStats();
  const statsData = stats.data;
  return (
    <section className="">
      <header className="text-2xl font-bold ">Welcome to Dashboard</header>
      <Stats session={session} statsData={statsData} />
    </section>
  );
};

export default Dashboard;
