import { UsersTable } from '@/components/modules/dashboard/users/usersTable';
import { userSerivce } from '@/services/user.service';

const userPage = async () => {
  const users = await userSerivce.getAllUsers();

  return <UsersTable users={users.data} />;
};

export default userPage;
