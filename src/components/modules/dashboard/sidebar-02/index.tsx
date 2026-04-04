import { DashboardSidebar } from '@/components/modules/dashboard/sidebar-02/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function Sidebar02() {
  return (
    <SidebarProvider>
      <div className="relative flex h-dvh w-full">
        <DashboardSidebar />
        <SidebarInset className="flex flex-col">
          <div />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
