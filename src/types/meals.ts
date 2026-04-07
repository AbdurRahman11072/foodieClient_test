export type Meal = {
  id: string;
  restaurantId: string;
  name: string;
  coverImg: string;
  description: string;
  price: number;
  rating: number;
  catagory: string[];
  available: boolean;
  ingredients: string[];
  allergens: string[];
  calories: number;
  servingSize: string;
  createdAt: Date;
  updatedAt: Date;
  restaurant?: {
    id: string;
    name: string;
  };
};

export interface MealsTableProps {
  meals: Meal[] | [];
  onEdit?: (meal: Meal) => void;
  onDelete?: (meal: Meal) => void;
  onDuplicate?: (meal: Meal) => void;
  onToggleAvailability?: (meal: Meal) => void;
  onView?: (meal: Meal) => void;
}

export interface MealUpdateSheetProps {
  meal: Meal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
