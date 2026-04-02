import { DashboardSidebar } from '@/components/sidebar-02/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { userSerivce } from '@/services/user.service';
import AdminDashboard from './@admin/dashboard/page';
import ProviderDashboard from './@provider/dashboard/page';

export default async function dashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await userSerivce.getUserSession();
  console.log(session);

  return (
    <SidebarProvider>
      <div className="relative flex h-dvh w-full">
        <DashboardSidebar />
        <SidebarInset className="flex flex-col">
          {session?.user?.role === 'admin' ? (
            <AdminDashboard />
          ) : (
            <ProviderDashboard />
          )}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
