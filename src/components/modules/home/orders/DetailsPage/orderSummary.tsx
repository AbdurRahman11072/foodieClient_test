// components/orders/OrderSummary.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Order } from '@/types/order';
import { AlertCircle, CreditCard, DollarSign, XCircle } from 'lucide-react';

// Fix: Accept props as an object
interface OrderSummaryProps {
  order: Order;
}

const OrderSummary = ({ order }: OrderSummaryProps) => {
  // Destructure order from props
  const calculateSubtotal = () => {
    return order.items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1;
  };

  const calculateDeliveryFee = () => {
    return 2.99;
  };

  return (
    <div className="lg:col-span-1 space-y-6">
      {/* Price Summary */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Price Summary
        </h2>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground">
              ${calculateSubtotal().toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax (10%)</span>
            <span className="text-foreground">
              ${calculateTax().toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Delivery Fee</span>
            <span className="text-foreground">
              ${calculateDeliveryFee().toFixed(2)}
            </span>
          </div>

          <Separator className="my-3" />

          <div className="flex justify-between items-center">
            <span className="font-bold text-foreground">Total</span>
            <span className="text-2xl font-bold text-primary">
              ${order.totalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </Card>

      {/* Payment Information */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          Payment Information
        </h2>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Method</span>
            <span className="text-foreground font-medium">
              {order.paymentMethod}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
              Paid
            </Badge>
          </div>
        </div>
      </Card>

      {/* Order Actions */}
      {order.status === 'PREPARING' && (
        <Card className="p-6 border-destructive/20">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Order Actions
          </h2>
          <form action={`/api/orders/${order.id}/cancel`} method="POST">
            <Button
              type="submit"
              variant="outline"
              className="w-full text-destructive hover:bg-destructive/10 border-destructive/30"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancel Entire Order
            </Button>
          </form>
          <p className="text-xs text-muted-foreground text-center mt-3">
            Only orders that are still preparing can be cancelled
          </p>
        </Card>
      )}
    </div>
  );
};

export default OrderSummary;
