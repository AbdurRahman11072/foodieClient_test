import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Cta = () => {
  return (
    <section className="bg-primary text-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Order?</h2>
        <p className="text-lg opacity-90 mb-8 text-balance">
          Join thousands of customers enjoying delicious meals delivered to
          their door.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/meals">
            <Button
              size="lg"
              variant="hero"
              className="w-full sm:w-auto  dark:hover:text-background hover:text-foreground"
            >
              Start Ordering Now
            </Button>
          </Link>
          <Link href="/register">
            <Button
              size="lg"
              variant="heroOutline"
              className="w-full sm:w-auto   bg-transparent hover:bg-white hover:text-primary"
            >
              Create Account
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Cta;
