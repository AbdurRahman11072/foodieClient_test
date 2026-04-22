export interface CartItem {
  customerId?: string;
  restaurantId?: string;
  menuItemId?: string;
  deliveryAddress?: string;
  status?: string;
  name?: string;
  image?: string;
  quantity: number;
  price?: number;
  // Add other properties as needed
}
