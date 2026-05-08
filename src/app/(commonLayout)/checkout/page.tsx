import CheckoutPage from '@/components/modules/home/checkout/checkout';
import { userSerivce } from '@/services/user.service';



const checkOutPage = async () => {
  const session = await userSerivce.getUserSession();

  return <CheckoutPage session={session} />;
};

export default checkOutPage;
