import CheckoutPage from '@/components/modules/home/checkout/checkout';
import { userSerivce } from '@/services/user.service';

export const dynamic = 'force-dynamic';

const checkOutPage = async () => {
  const session = await userSerivce.getUserSession();
  console.log(session);

  return <CheckoutPage session={session} />;
};

export default checkOutPage;
