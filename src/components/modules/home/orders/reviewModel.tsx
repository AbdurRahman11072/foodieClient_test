// components/orders/reviewModel.tsx
'use client';

import { CreateReviewAction } from '@/actions/review';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  userId: string;
  userName: string;
  userImg: string;
  restaurantId: string;
  mealId: string;
  onSuccess?: () => void;
}

export function ReviewModal({
  isOpen,
  onClose,
  itemName,
  userId,
  userName,
  userImg,
  restaurantId,
  mealId,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [description, setDescription] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    if (!description.trim()) {
      setError('Please write a review');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const reviewData = {
        rating,
        description,
        userId,
        userName: userName,
        userImg: userImg,
        restaurantId,
        mealId,
      };

      console.log('Submitting review:', reviewData);

      const result = await CreateReviewAction(reviewData);

      if (!result.success) {
        return toast.error(result.message);
      }

      console.log('Review submitted successfully:', result.data);
      resetForm();
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Failed to submit review. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setRating(0);
    setDescription('');
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
          <DialogDescription>
            Share your experience with {itemName}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Rating Stars */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => {
                const isActive = (hoveredRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    className="focus:outline-none transition-transform hover:scale-110"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      className={`h-8 w-8 ${
                        isActive
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-muted text-muted-foreground'
                      } transition-colors`}
                    />
                  </button>
                );
              })}
            </div>
            {rating > 0 && (
              <p className="text-sm text-muted-foreground">
                {rating === 5 && 'Excellent! ⭐'}
                {rating === 4 && 'Very Good! 👍'}
                {rating === 3 && 'Good 🙂'}
                {rating === 2 && 'Fair 😐'}
                {rating === 1 && 'Poor 😞'}
              </p>
            )}
          </div>

          {/* Review Description */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Your Review</label>
            <Textarea
              placeholder="Share your thoughts about this meal..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="text-white"
          >
            {isLoading ? 'Submitting...' : 'Submit Review'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
