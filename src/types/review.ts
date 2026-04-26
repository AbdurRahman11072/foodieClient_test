export type CreateReviewType = {
  rating: number;
  description: string;
  userId: string;
  userName: string;
  userImg: string | null;
  restaurantId: string;
  mealId: string;
};

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userImg: string | null;
  restaurantId: string;
  mealId: string;
  rating: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}
