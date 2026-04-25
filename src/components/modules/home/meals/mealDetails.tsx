'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CartItem } from '@/types/cart';
import { SessionData } from '@/types/session';
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Star,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface MealDetailsCardProps {
  meal: {
    id: string;
    name: string;
    coverImg: string;
    description: string;
    price: number;
    rating: number;
    available: boolean;
    ingredients: string[];
    calories: number;
    servingSize: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    restaurant: {
      id: string;
      name: string;
      coverImg: string;
      rating: number;
      openingTime: string;
      closingTime: string;
    };
  };
  session: SessionData | null;
}

const MealDetailsCard = ({ meal, session }: MealDetailsCardProps) => {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  // Calculate delivery time based on restaurant hours
  const getDeliveryTime = () => {
    const opening = meal.restaurant.openingTime;
    const closing = meal.restaurant.closingTime;
    return `${opening} - ${closing}`;
  };

  const customerId = session?.user.id;
  const restaurantId = session?.user.restaurantId;

  const addToCart = async () => {
    const cartData = {
      restaurantId: meal.restaurant.id,
      restaurantName: meal.restaurant.name,
      mealId: meal?.id,
      mealName: meal.name,
      mealImg: meal.coverImg,
      quantity: quantity,
      price: meal?.price,
      totalPrice: quantity * meal?.price,
    };

    const existingCart = JSON.parse(localStorage.getItem('cart') || `[]`);

    const itemExist = existingCart.findIndex(
      (item: CartItem) => item.mealId === meal?.id
    );

    if (itemExist > -1) {
      // Update quantity if item exists
      existingCart[itemExist].quantity += quantity;
      toast.success('Food cart has been updated with new quantity');
      router.push('/cart');
    } else {
      // Add new item
      existingCart.push(cartData);
      toast.success('Food has been added to the cart');
      router.push('/cart');
    }

    localStorage.setItem('cart', JSON.stringify(existingCart));
  };

  return (
    <div className="flex-1 py-8 md:py-12">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/meals"
          className="inline-flex items-center gap-2 text-primary hover:underline mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to meals
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Meal Image */}
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg h-96 flex items-center justify-center overflow-hidden relative">
            {meal.coverImg ? (
              <Image
                src={meal.coverImg}
                alt={meal.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <span className="text-9xl">🍽️</span>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <p className="text-sm text-muted-foreground mb-1 capitalize">
                {meal.status === 'DRFT' ? 'Draft' : 'Available'}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {meal.name}
              </h1>
              <p className="text-muted-foreground text-lg">
                {meal.description}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 bg-primary/10 px-3 py-2 rounded">
                <Star className="h-5 w-5 fill-primary text-primary" />
                <span className="font-semibold text-primary">
                  {meal.rating.toFixed(1)}
                </span>
                <span className="text-muted-foreground">(0 reviews)</span>
              </div>
              {meal.available ? (
                <span className="text-green-600 text-sm font-medium">
                  Available
                </span>
              ) : (
                <span className="text-red-600 text-sm font-medium">
                  Not Available
                </span>
              )}
            </div>

            {/* Restaurant Info with Cover Image */}
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-2">
                Available from
              </p>
              <div className="flex items-center gap-4">
                {/* Restaurant Cover Image */}
                <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                  {meal.restaurant.coverImg ? (
                    <Image
                      src={meal.restaurant.coverImg}
                      alt={meal.restaurant.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <span className="text-2xl">🏪</span>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {meal.restaurant.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {getDeliveryTime()} hours
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="text-sm font-semibold">
                        {meal.restaurant.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Price and Quantity */}
            <div className="border-t border-border pt-6">
              <p className="text-sm text-muted-foreground mb-4">
                Price per serving
              </p>
              <div className="flex items-center justify-between mb-6">
                <span className="text-4xl font-bold text-primary">
                  ${meal.price.toFixed(2)}
                </span>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-secondary transition-colors"
                    disabled={!meal.available}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-secondary transition-colors"
                    disabled={!meal.available}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1 gap-2 text-white"
                  disabled={!meal.available}
                  onClick={() => addToCart()}
                >
                  <ShoppingCart className="h-5 w-5 " />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart
                    className="h-5 w-5"
                    fill={isFavorite ? 'currentColor' : 'none'}
                    color={isFavorite ? 'rgb(239, 68, 68)' : 'currentColor'}
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pt-8 border-t border-border">
          {/* Ingredients */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">
              Ingredients
            </h3>
            {meal.ingredients && meal.ingredients.length > 0 ? (
              <ul className="space-y-2">
                {meal.ingredients.map((ingredient, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-foreground"
                  >
                    <span className="w-2 h-2 bg-primary rounded-full" />
                    {ingredient}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No ingredients listed</p>
            )}
          </div>

          {/* Nutrition & Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-foreground mb-4">
                Nutrition Info
              </h3>
              <Card className="p-4">
                <div className="flex items-center justify-between py-2">
                  <span className="text-foreground">Calories</span>
                  <span className="font-semibold">{meal.calories} kcal</span>
                </div>
                <div className="flex items-center justify-between py-2 border-t border-border">
                  <span className="text-foreground">Serving Size</span>
                  <span className="font-semibold">{meal.servingSize}</span>
                </div>
              </Card>
            </div>

            {/* Additional Info */}
            <div>
              <h3 className="text-lg font-bold text-foreground mb-4">
                Additional Info
              </h3>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Status:</span>{' '}
                  <span className="capitalize">{meal.status}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Added on:</span>{' '}
                  {new Date(meal.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealDetailsCard;
