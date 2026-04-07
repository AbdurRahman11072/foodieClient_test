import AddCategory from '@/components/modules/dashboard/category/addCategory';
import AllCategory from '@/components/modules/dashboard/category/allCategory';

const CategoryPage = () => {
  return (
    <section id="categroy" className="space-y-6">
      <div className="flex justify-between">
        <p className="text-3xl font-bold">All Categories</p>
        <AddCategory />
      </div>

      <AllCategory />
    </section>
  );
};

export default CategoryPage;
