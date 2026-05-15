import AppPromo from '@/components/modules/home/appPromo';
import HomeCategories from '@/components/modules/home/category';
import Cta from '@/components/modules/home/cta';
import FeaturedMeals from '@/components/modules/home/featuredMeals';
import FooterSection from '@/components/modules/home/footer';
import Hero from '@/components/modules/home/hero';
import HowItWorks from '@/components/modules/home/howItWorks';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <div className="container mx-auto space-y-20 my-8">
      <Hero />
      <HomeCategories />
      <FeaturedMeals />
      <HowItWorks />
      <Cta />
      <AppPromo />
      <Separator />
      <FooterSection />
    </div>
  );
}
