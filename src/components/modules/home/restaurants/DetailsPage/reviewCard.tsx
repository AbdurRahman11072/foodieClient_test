// components/modules/home/restaurants/restaurant-reviews.tsx
'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Flag, MessageCircle, Star, ThumbsUp } from 'lucide-react';
import { useState } from 'react';

interface Review {
  id?: string;
  userName: string;
  rating: number;
  description: string;
  updatedAt: string;
}

interface ReviewsSectionProps {
  reviews: Review[];
  restaurantName: string;
}

export function ReviewsSection({
  reviews,
  restaurantName,
}: ReviewsSectionProps) {


  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.floor(r.rating) === star).length;
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { star, count, percentage };
  });

  if (reviews.length === 0) {
    return (
      <Card className="p-12 text-center">
        <MessageCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Reviews Yet</h3>
        <p className="text-muted-foreground">
          Be the first to review {restaurantName}!
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left - Average Rating */}
          <div className="text-center md:text-left">
            <div className="text-5xl font-bold text-foreground mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < Math.floor(averageRating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Based on {reviews.length} reviews
            </p>
          </div>

          {/* Right - Rating Distribution */}
          <div className="space-y-2">
            {ratingDistribution.map(({ star, percentage }) => (
              <div key={star} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm">{star}</span>
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                </div>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-12">
                  {percentage.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <ReviewCard key={review.id || index} review={review} />
        ))}
      </div>
    </div>
  );
}

// Review Card Component
function ReviewCard({ review }: { review: Review }) {
  const [isLiked, setIsLiked] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarFallback className="bg-primary/10 text-primary">
            {review.userName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
            <div>
              <p className="font-semibold text-foreground">{review.userName}</p>
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${i < Math.floor(review.rating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`}
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-1">
                  {review.rating}
                </span>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">
              {formatDate(review.updatedAt)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {review.description}
          </p>

          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <ThumbsUp
                className={`h-3.5 w-3.5 ${isLiked ? 'fill-current text-primary' : ''}`}
              />
              <span>Helpful</span>
            </button>
            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
              <Flag className="h-3.5 w-3.5" />
              <span>Report</span>
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
