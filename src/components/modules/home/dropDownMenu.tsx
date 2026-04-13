import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { userRole } from '@/constants';
import { authClient } from '@/lib/auth-client';
import {
  CircleUserIcon,
  LayoutDashboard,
  LogOut,
  Settings2Icon,
  StoreIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const DropDownMenu = ({
  name,
  image,
  role,
}: {
  name: string;
  image: string;
  role: string;
}) => {
  const router = useRouter();
  const signOut = async () => {
    const toastId = toast.loading('Login out user');
    try {
      const { data, error } = await authClient.signOut();

      if (error) {
        toast.error(error.message, { id: toastId });
      }
      toast.success('LogOut successfull', { id: toastId });
      router.push('/');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong. Please try again later', {
        id: toastId,
      });
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {image ? (
          <Image
            src={image}
            alt="profile image"
            width={20}
            height={20}
            className="w-8 h-8 bg-white rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-md">
            {name?.charAt(0).toUpperCase()}
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>

          <Link href="/profile">
            <DropdownMenuItem className="text-black dark:text-white">
              <CircleUserIcon className="text-black dark:text-white" /> Profile
            </DropdownMenuItem>
          </Link>
          {role === userRole.user ? (
            <Link href="/restaurants/create-restaurant">
              <DropdownMenuItem className="text-black dark:text-white">
                <StoreIcon className="text-black dark:text-white" /> Create
                Restaurant
              </DropdownMenuItem>
            </Link>
          ) : (
            <Link href="/dashboard">
              <DropdownMenuItem className="text-black dark:text-white">
                <LayoutDashboard className="text-black dark:text-white" />
                Dashbaord
              </DropdownMenuItem>
            </Link>
          )}
          <Link href="setting">
            <DropdownMenuItem className="text-black dark:text-white">
              <Settings2Icon className="text-black dark:text-white" /> Setting
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => signOut()} variant="destructive">
            <LogOut className=" font-bold " />
            Log Out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropDownMenu;
