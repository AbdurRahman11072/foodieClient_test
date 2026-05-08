import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import Link from 'next/link';

const ProfileHeader = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          My Profile
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences.
        </p>
      </div>
      <Button asChild className="gap-2 w-full md:w-auto shadow-sm text-white">
        <Link href="/setting">
          <Edit className="w-4 h-4" />
          Edit Profile
        </Link>
      </Button>
    </div>
  );
};

export default ProfileHeader;
