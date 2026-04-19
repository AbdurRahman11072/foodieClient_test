export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  role?: string | null;
  banned?: boolean | null;
  banReason?: string | null;
  banExpires?: Date | string | null;
  restaurantId?: string | null;
  restaurant?: Restaurant | null;
}

export interface Restaurant {
  id: string;
  name: string;
  coverImg?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}
