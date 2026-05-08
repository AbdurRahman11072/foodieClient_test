'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Store, Users, ExternalLink } from 'lucide-react';

export const PopularMeals = ({ meals }: { meals: any[] }) => {
  return (
    <Card className="border-none bg-white/50 backdrop-blur-md dark:bg-zinc-900/50 shadow-sm transition-all duration-300 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <ShoppingBag className="w-5 h-5 text-primary" />
          </div>
          <CardTitle className="text-lg font-bold">Popular Meals</CardTitle>
        </div>
        <button className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
          View all <ExternalLink className="w-3 h-3" />
        </button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {meals?.slice(0, 5).map((meal, index) => (
            <div key={index} className="flex items-center justify-between group p-2 rounded-xl hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center font-bold text-white shadow-lg shadow-primary/20">
                  {index + 1}
                </div>
                <div>
                  <p className="font-semibold text-sm">{meal.mealName}</p>
                  <p className="text-xs text-muted-foreground font-medium">{meal._count.mealId} Orders</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[10px] uppercase tracking-wider font-bold">
                Trending
              </Badge>
            </div>
          ))}
          {(!meals || meals.length === 0) && (
            <div className="flex flex-col items-center justify-center py-8 opacity-50">
               <ShoppingBag className="w-8 h-8 mb-2" />
               <p className="text-sm font-medium">No data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const RecentRestaurants = ({ restaurants }: { restaurants: any[] }) => {
  return (
    <Card className="border-none bg-white/50 backdrop-blur-md dark:bg-zinc-900/50 shadow-sm transition-all duration-300 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Store className="w-5 h-5 text-blue-500" />
          </div>
          <CardTitle className="text-lg font-bold">Recent Restaurants</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {restaurants?.slice(0, 5).map((restaurant, index) => (
            <div key={index} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
              <Avatar className="h-10 w-10 border-2 border-white dark:border-zinc-800 shadow-sm">
                <AvatarImage src={restaurant.logo} alt={restaurant.name} />
                <AvatarFallback className="bg-blue-500/10 text-blue-500 font-bold">{restaurant.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-semibold leading-none">{restaurant.name}</p>
                <p className="text-xs text-muted-foreground mt-1 font-medium">{restaurant.address || 'New Store'}</p>
              </div>
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          ))}
          {(!restaurants || restaurants.length === 0) && (
            <div className="flex flex-col items-center justify-center py-8 opacity-50">
               <Store className="w-8 h-8 mb-2" />
               <p className="text-sm font-medium">No restaurants found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const NewUsers = ({ users }: { users: any[] }) => {
  return (
    <Card className="border-none bg-white/50 backdrop-blur-md dark:bg-zinc-900/50 shadow-sm transition-all duration-300 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <Users className="w-5 h-5 text-emerald-500" />
          </div>
          <CardTitle className="text-lg font-bold">New Users</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users?.slice(0, 5).map((user, index) => (
            <div key={index} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
              <Avatar className="h-10 w-10 border-2 border-white dark:border-zinc-800 shadow-sm">
                <AvatarImage src={user.image} alt={user.name} />
                <AvatarFallback className="bg-emerald-500/10 text-emerald-500 font-bold">{user.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-semibold leading-none">{user.name}</p>
                <p className="text-xs text-muted-foreground mt-1 font-medium truncate max-w-[120px]">{user.email}</p>
              </div>
              <Badge variant="outline" className="text-[10px] uppercase font-bold border-zinc-200 dark:border-zinc-700">
                {user.role}
              </Badge>
            </div>
          ))}
          {(!users || users.length === 0) && (
            <div className="flex flex-col items-center justify-center py-8 opacity-50">
               <Users className="w-8 h-8 mb-2" />
               <p className="text-sm font-medium">No new users</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
