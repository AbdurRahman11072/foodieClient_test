import HomeCategories from '@/components/modules/home/category';
import Cta from '@/components/modules/home/cta';
import FeaturedMeals from '@/components/modules/home/featuredMeals';
import Hero from '@/components/modules/home/hero';

export default function Home() {
  return (
    <div className="container mx-auto space-y-20 my-8">
      <Hero />
      <HomeCategories />
      <FeaturedMeals />
      <Cta />
    </div>
  );
}
