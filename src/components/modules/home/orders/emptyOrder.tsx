// components/orders/EmptyOrdersState.tsx
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Package } from 'lucide-react';
import Link from 'next/link';

export function EmptyOrdersState() {
  return (
    <Card className="m-12 text-center h-[80vh] flex justify-center items-center">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <Package className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          No Orders Yet
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Looks like you haven't placed any orders yet. Start exploring our
          delicious meals!
        </p>
        <Link href="/meals">
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Start Ordering
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
