import { Meal } from './meals';
import { Review } from './review';

export interface Restaurant {
  id: string;
  ownerId: string;
  name: string;
  description?: string | null;
  avatarImg?: string | null;
  coverImg?: string | null;
  rating?: number | null;
  openingTime?: string | null;
  closingTime?: string | null;
  offday?: string | null;
  banned?: boolean;
  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;
  meals?: Meal[];
  reviews?: Review[];
}
