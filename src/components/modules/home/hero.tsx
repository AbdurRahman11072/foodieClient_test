import header_img from '@/assets/frontend_assets/header_img.png';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search, Zap } from 'lucide-react';
import Link from 'next/link';

const Hero = () => {
  return (
    <section
      className="relative bg-center sm:bg-cover lg:bg-cover  lg:bg-no-repeat   rounded-2xl  h-[70vh] "
      style={{ backgroundImage: `url(${header_img.src})` }}
    >
      {/* Optional overlay for better text readability */}
      <div className="absolute inset-0   " />

      <div className="relative mx-auto max-w-7xl px-8 h-full ">
        <div className="flex items-center h-full ">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12 items-center py-8 sm:py-12 lg:py-0">
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white text-balance leading-tight">
                  Discover & Order
                  <span className="block text-white mt-2 sm:mt-3 lg:mt-4">
                    Delicious Meals
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-white font-mono  mt-3 sm:mt-4 lg:mt-6 text-balance max-w-xl">
                  Browse thousands of meals from your favorite restaurants and
                  get them delivered hot to your door.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link href="/meals" className="flex-1 sm:flex-none">
                  <Button
                    type="button"
                    variant="hero"
                    size="lg"
                    className="w-full sm:w-auto justify-center px-6 sm:px-8"
                  >
                    <Search className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Browse Meals
                  </Button>
                </Link>
                <Link href="/restaurants" className="flex-1 sm:flex-none">
                  <Button
                    size="lg"
                    variant="heroOutline"
                    className="w-full sm:w-auto justify-center bg-transparent px-6 sm:px-8"
                  >
                    View Restaurants
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </Link>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-4 sm:pt-6 lg:pt-8">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  <span className="text-sm sm:text-base font-medium text-white">
                    Fast Delivery
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  <span className="text-sm sm:text-base font-medium text-white">
                    Wide Selection
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  <span className="text-sm sm:text-base font-medium text-white">
                    Best Prices
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  <span className="text-sm sm:text-base font-medium text-white">
                    Easy Payment
                  </span>
                </div>
              </div>
            </div>

            {/* Illustration - Only on larger screens */}
            <div className="hidden md:flex items-center justify-center lg:justify-end">
              {/* Add your illustration component here if needed */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
