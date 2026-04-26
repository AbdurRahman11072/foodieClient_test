// components/orders/CancelOrderAction.tsx
'use client';

import { cancelOrderAction } from '@/actions/orders';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface CancelOrderActionProps {
  orderId: string;
  orderStatus: string;
  buttonText?: string;
  variant?: 'default' | 'outline' | 'destructive';
  size?: 'default' | 'sm' | 'lg';
}

export function CancelOrderAction({
  orderId,
  orderStatus,
  buttonText = 'Cancel Order',
  variant = 'outline',
  size = 'sm',
}: CancelOrderActionProps) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const router = useRouter();

  const canCancel = orderStatus === 'PENDING' || orderStatus === 'PREPARING';

  if (!canCancel) return null;

  const handleCancelClick = () => {
    setCancelDialogOpen(true);
  };

  const handleConfirmCancel = async () => {
    setIsCancelling(true);

    try {
      const result = await cancelOrderAction(orderId);

      if (result.success) {
        toast.success(result.message || 'Order cancelled successfully');
        setCancelDialogOpen(false);
        setCancelReason('');
        router.refresh();
      } else {
        toast.error(result.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <>
      <Button
        size={size}
        variant={variant}
        className="text-destructive hover:bg-destructive/10 border-destructive/30"
        onClick={handleCancelClick}
        disabled={isCancelling}
      >
        {isCancelling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isCancelling ? 'Cancelling...' : buttonText}
      </Button>

      {/* Cancel Order Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this order? This action cannot be
              undone.
              {orderStatus === 'PREPARING' && (
                <span className="block mt-2 text-amber-600 dark:text-amber-500">
                  Note: Your order is already being prepared. Please contact the
                  restaurant if you have any issues.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="mt-4">
            <label className="text-sm font-medium mb-2 block">
              Reason for cancellation (optional)
            </label>
            <Textarea
              placeholder="e.g., Changed my mind, Wrong address, Found better price..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>
              Keep Order
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              disabled={isCancelling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isCancelling && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isCancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
