import Stats from '@/components/modules/dashboard/stats';
import { userSerivce } from '@/services/user.service';

const Dashboard = async () => {
  const session = await userSerivce.getUserSession();
  return (
    <section className="">
      <header className="text-2xl font-bold ">Welcome to Dashboard</header>
      <Stats session={session} />
    </section>
  );
};

export default Dashboard;
