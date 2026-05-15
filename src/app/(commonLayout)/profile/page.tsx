import ProfileCard from '@/components/modules/home/profile/ProfileCard';
import ProfileHeader from '@/components/modules/home/profile/ProfileHeader';
import RestaurantCard from '@/components/modules/home/profile/RestaurantCard';
import restaurantService from '@/services/restaurant.service';
import type { Restaurant } from '@/types/restaurant';
import { userService } from '@/services/user.service';


export const metadata = {
  title: 'Profile | Foodie',
  description: 'Manage your profile and settings.',
};

export default async function ProfilePage() {
  const sessionData = await userService.getUserSession();

  if (!sessionData) return null;

  const { user } = sessionData;

  let restaurantData: Restaurant | null = null;
  // @ts-ignore
  if (user.restaurantId) {
    // @ts-ignore
    const res = await restaurantService.getRestaurantById(user.restaurantId);
    if (res?.success) {
      restaurantData = res.data as Restaurant;
    }
  }


  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-[80vh]">
      <div className="w-full space-y-8">
        <ProfileHeader />

        <div
          className={`grid grid-cols-1 gap-8 ${restaurantData ? 'lg:grid-cols-3' : ''}`}
        >
          <ProfileCard user={user} hasRestaurant={!!restaurantData} />

          {restaurantData && <RestaurantCard restaurant={restaurantData} />}
        </div>
      </div>
    </div>
  );
}
