import SettingsForm from '@/components/modules/home/profile/SettingsForm';
import { userService } from '@/services/user.service';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';


export const metadata = {
  title: 'Settings | Foodie',
  description: 'Manage your account settings.',
};



export default async function SettingPage() {
  const sessionData = await userService.getUserSession();

  if (!sessionData) return null;

  const { user } = sessionData;

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-[80vh]">
      <div className="w-full max-w-5xl mx-auto space-y-8">

        {/* Page header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link
              href="/profile"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Profile
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Account Settings
            </h1>
            <p className="text-muted-foreground mt-1">
              Update your personal information and security preferences.
            </p>
          </div>
        </div>

        {/* Forms */}
        <SettingsForm
          userId={user.id}
          defaultName={user.name ?? ''}
          defaultImage={user.image ?? ''}
        />
      </div>
    </div>
  );
}
