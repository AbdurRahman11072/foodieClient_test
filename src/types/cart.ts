export interface CartItem {
  restaurantId?: string;
  restaurantName?: string;
  mealId?: string;
  mealName?: string;
  mealImg?: string;
  quantity: number;
  price?: number;
  totalPrice?: number;
  status?: string;
  // Add other properties as needed
}
