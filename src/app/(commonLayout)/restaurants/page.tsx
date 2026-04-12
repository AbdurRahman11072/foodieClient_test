// Example usage in a page

import RestaurantGrid from '@/components/modules/home/restaurants/restaurantDetails';

const sampleRestaurants = [
  {
    id: '1',
    name: 'The Gourmet Kitchen',
    coverImg: '/images/restaurant1.jpg',
    avatarImg: '/images/avatar1.jpg',
    description:
      'Fine dining experience with authentic Italian cuisine. Our chefs prepare every dish with passion and the finest ingredients.',
    openingTime: '11:00',
    closingTime: '22:00',
    offday: 'Monday',
    rating: 4.8,
    totalOrders: 2345,
    followers: 12345,
  },
  {
    id: '2',
    name: 'Sushi Master',
    coverImg: '/images/restaurant2.jpg',
    avatarImg: '/images/avatar2.jpg',
    description:
      'Authentic Japanese sushi and sashimi prepared by master chefs. Fresh fish imported daily from Tokyo.',
    openingTime: '12:00',
    closingTime: '23:00',
    offday: 'Sunday',
    rating: 4.9,
    totalOrders: 3456,
    followers: 23456,
  },
  {
    id: '3',
    name: 'Burger Joint',
    coverImg: '/images/restaurant3.jpg',
    description:
      'Best burgers in town with homemade sauces and fresh ingredients. Vegan options available.',
    openingTime: '10:00',
    closingTime: '21:00',
    offday: 'Tuesday',
    rating: 4.5,
    totalOrders: 5678,
    followers: 7890,
    isBanned: true,
  },
];

export default function RestaurantsPage() {
  return (
    <RestaurantGrid
      restaurants={sampleRestaurants}
      title="Restaurants"
      subtitle="Discover the best restaurants in your area"
    />
  );
}
