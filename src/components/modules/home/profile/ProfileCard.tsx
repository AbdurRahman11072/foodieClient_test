import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  CalendarDays,
  Clock,
  Mail,
  ShieldCheck,
  User as UserIcon,
} from 'lucide-react';

interface ProfileCardProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
    emailVerified?: boolean | null;
    createdAt?: string | Date | null;
    updatedAt?: string | Date | null;
  };
  hasRestaurant: boolean;
}

const ProfileCard = ({ user, hasRestaurant }: ProfileCardProps) => {
  return (
    <Card
      className={`overflow-hidden border-border/50 shadow-md transition-shadow hover:shadow-lg dark:bg-card/40 dark:backdrop-blur-xl ${hasRestaurant ? 'lg:col-span-2' : ''}`}
    >
      {/* Banner */}
      <div className="h-32 w-full bg-gradient-to-r from-primary/80 via-primary/60 to-primary/40 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      </div>

      <CardContent className="p-6 sm:p-10 relative">
        {/* Avatar — overlaps banner */}
        <div className="absolute -top-16 flex items-end justify-between w-[calc(100%-3rem)] sm:w-[calc(100%-5rem)]">
          <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
            <AvatarImage
              src={user.image || ''}
              alt={user.name || 'User avatar'}
              className="object-cover"
            />
            <AvatarFallback className="text-4xl font-bold bg-primary text-primary-foreground">
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>

        <div
          className={`mt-16 sm:mt-20 flex flex-col ${hasRestaurant ? 'xl:flex-row' : 'md:flex-row'} gap-8 justify-between`}
        >
          {/* Left — Basic Info */}
          <div className="space-y-6 flex-1">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">{user.name}</h2>
              <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge
                  variant="secondary"
                  className="px-3 py-1 capitalize text-sm font-medium"
                >
                  {user.role || 'User'}
                </Badge>
                {user.emailVerified && (
                  <Badge
                    variant="outline"
                    className="px-3 py-1 text-sm font-medium border-green-500/30 text-green-600 dark:text-green-400 bg-green-500/10"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>

            <Separator className="bg-border/50" />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold tracking-tight flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-primary" />
                Account Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    User ID
                  </p>
                  <p className="font-mono text-sm break-all">{user.id}</p>
                </div>

                <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    Role
                  </p>
                  <p className="font-medium capitalize">{user.role || 'User'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Activity / Dates */}
          <div
            className={`space-y-6 flex-1 ${hasRestaurant ? 'xl:max-w-xs' : 'md:max-w-xs'}`}
          >
            <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm h-full">
              <h3 className="text-lg font-semibold tracking-tight mb-6">
                Activity
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2.5 rounded-full text-primary mt-0.5">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Joined Foodie</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString(
                            undefined,
                            { year: 'numeric', month: 'long', day: 'numeric' }
                          )
                        : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2.5 rounded-full text-primary mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {user.updatedAt
                        ? new Date(user.updatedAt).toLocaleDateString(
                            undefined,
                            { year: 'numeric', month: 'long', day: 'numeric' }
                          )
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
