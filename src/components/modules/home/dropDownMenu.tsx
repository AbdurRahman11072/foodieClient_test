import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { authClient } from '@/lib/auth-client';
import {
  CircleUserIcon,
  LayoutDashboard,
  LogOut,
  Settings2Icon,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const DropDownMenu = ({ image }: { image: string }) => {
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
        <Image
          src={image as string}
          alt="profile image"
          width={20}
          height={20}
          className=" w-8 h-8 bg-white rounded-full"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem>
            <CircleUserIcon /> Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LayoutDashboard /> Dashbaord
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings2Icon /> Setting
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => signOut()}>
            <LogOut className="text-red-600 font-bold" />
            Log Out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropDownMenu;
