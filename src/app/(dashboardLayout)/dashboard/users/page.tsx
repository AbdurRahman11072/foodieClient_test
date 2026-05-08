import { userService } from '@/services/user.service';
import { UsersTable } from '@/components/modules/dashboard/users/usersTable';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const userPage = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page as string) : 1;
  const limit = 10;

  const users = await userService.getAllUsers(page, limit);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground mt-1">Manage all system users</p>
        </div>
        <div className="text-sm text-muted-foreground">
          Total Users: {users.data.total}
        </div>
      </div>
      <UsersTable
        users={users.data.data}
        totalItems={users.data.total}
        currentPage={page}
        limit={limit}
      />
    </div>
  );
};

export default userPage;
