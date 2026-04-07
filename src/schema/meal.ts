import { Meal } from '@/types/meals';
import z from 'zod';

export const MealUpdateFormSchema = z.object({
  id: z.string().uuid(), // Required
  restaurantId: z.string().min(1, 'Restaurant ID is required'),
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  coverImg: z
    .string()
    .url('Invalid image URL')
    .min(1, 'Cover image is required'),
  description: z.string().min(1, 'Description is required'),
  price: z
    .number()
    .positive('Price must be positive')
    .min(0.01, 'Price must be at least 0.01'),
  rating: z
    .number()
    .min(0, 'Rating must be at least 0')
    .max(5, 'Rating cannot exceed 5'),
  category: z.array(z.string()).min(1, 'At least one category is required'),
  available: z.boolean(),
  ingredients: z
    .array(z.string().min(1, 'Ingredient cannot be empty'))
    .min(1, 'At least one ingredient is required'),
  allergens: z.array(z.string()),
  calories: z
    .number()
    .int('Calories must be an integer')
    .positive('Calories must be positive')
    .min(0, 'Calories cannot be negative'),
  servingSize: z.string().min(1, 'Serving size is required'),
});

export type MealUpdateFormSchemaType = z.infer<typeof MealUpdateFormSchema>;

// Then use it with defaultValues (all fields present)

export interface MealUpdateSheetProps {
  meal: Meal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
