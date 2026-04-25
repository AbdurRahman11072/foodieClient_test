import { Bike, CheckCircle, ChefHat, Clock, XCircle } from 'lucide-react';

export const STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    icon: Clock, // Changed from ChefHat to Clock
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/20',
    textColor: 'text-primary',
    badgeColor: 'bg-primary/10 text-primary border-primary/20',
    description: 'Your order is pending confirmation',
    iconBg: 'bg-primary/10',
  },
  PREPARING: {
    label: 'Preparing',
    icon: ChefHat,
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/20',
    textColor: 'text-primary',
    badgeColor: 'bg-primary/10 text-primary border-primary/20',
    description: 'Your order is being prepared',
    iconBg: 'bg-primary/10',
  },
  DELIVERING: {
    label: 'Delivering',
    icon: Bike,
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    textColor: 'text-blue-500',
    badgeColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    description: 'Your order is on the way',
    iconBg: 'bg-blue-500/10',
  },
  COMPLETE: {
    label: 'Delivered',
    icon: CheckCircle,
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
    textColor: 'text-emerald-500',
    badgeColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    description: 'Your order has been delivered',
    iconBg: 'bg-emerald-500/10',
  },
  CANCELLED: {
    label: 'Cancelled',
    icon: XCircle,
    bgColor: 'bg-destructive/10',
    borderColor: 'border-destructive/20',
    textColor: 'text-destructive',
    badgeColor: 'bg-destructive/10 text-destructive border-destructive/20',
    description: 'Your order was cancelled',
    iconBg: 'bg-destructive/10',
  },
};

// types/order.ts

export const ITEM_STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    icon: Clock,
    canCancel: true,
  },
  PREPARING: {
    label: 'Preparing',
    color: 'bg-primary/10 text-primary border-primary/20',
    icon: ChefHat,
    canCancel: true,
  },
  READY: {
    label: 'Ready',
    color: 'bg-green-500/10 text-green-500 border-green-500/20',
    icon: CheckCircle,
    canCancel: false,
  },
  DELIVERED: {
    label: 'Delivered',
    color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    icon: CheckCircle,
    canCancel: false,
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'bg-destructive/10 text-destructive border-destructive/20',
    icon: XCircle,
    canCancel: false,
  },
};

export interface OrderItem {
  id: string;
  orderId: string;
  restaurantId: string;
  restaurantName: string;
  mealId: string;
  mealName: string;
  mealImg: string;
  quantity: number;
  price: number;
  totalPrice: number;
  status: keyof typeof ITEM_STATUS_CONFIG;
  createdAt: string;
}

export interface Order {
  id: string;
  orderId: string;
  userId: string;
  address: string;
  phoneNumber: string;
  totalPrice: number;
  status: keyof typeof STATUS_CONFIG;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}
