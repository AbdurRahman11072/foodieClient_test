import CheckoutPage from '@/components/modules/home/checkout/checkout';
import { userService } from '@/services/user.service';



const checkOutPage = async () => {
  const session = await userService.getUserSession();

  return <CheckoutPage session={session} />;
};

export default checkOutPage;
