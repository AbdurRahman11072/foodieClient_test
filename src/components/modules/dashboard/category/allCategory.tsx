import { Card } from '@/components/ui/card';
import { categoryService } from '@/services/category.service';
import Image from 'next/image';

import DeleteCategory from './deleteCategory';
import UpdateCategory from './updateCategory';

type Category = {
  id: string;
  name: string;
  coverImg: string;
  createdAt: Date;
  updatedAt: Date;
};

const AllCategory = async () => {
  const categories = await categoryService.getAllCategory();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-1">
      {categories?.map((category: Category) => (
        <Card
          key={category.id}
          className="group relative flex flex-col items-center p-6  
            border border-gray-200 dark:border-gray-800 rounded-2xl
            transition-all duration-300 ease-out
            hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1
            hover:border-primary/20 dark:hover:border-primary/30"
        >
          {/* Action Buttons Container - Horizontal Layout */}
          <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
            {/* Edit Button */}
            <div className="grid grid-cols-1 gap-1.5">
              <UpdateCategory category={category} />

              {/* Delete Button */}
              <DeleteCategory
                categoryId={category.id}
                categoryName={category.name}
              />
            </div>
          </div>

          {/* Image Container */}
          <div className="relative mb-4">
            {/* Gradient Ring */}
            <div
              className="absolute -inset-1 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent 
              rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />

            {/* Image Wrapper with Scale Effect */}
            <div
              className="relative w-32 h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 
              rounded-full overflow-hidden
              ring-4 ring-gray-100 dark:ring-gray-800 
              group-hover:ring-primary/20 dark:group-hover:ring-primary/30
              transition-all duration-300"
            >
              <Image
                src={category.coverImg}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 
                  group-hover:scale-110"
                sizes="(max-width: 768px) 128px, (max-width: 1024px) 144px, 160px"
                priority
              />
              {/* Overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent 
                opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          </div>

          {/* Category Name */}
          <h3
            className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 
            text-center line-clamp-2 transition-colors duration-200
            group-hover:text-primary dark:group-hover:text-primary"
          >
            {category.name}
          </h3>

          {/* Decorative Line */}
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-0.5 
            bg-gradient-to-r from-transparent via-primary/30 to-transparent
            opacity-0 group-hover:opacity-100 transition-all duration-300
            group-hover:w-16"
          />
        </Card>
      ))}
    </div>
  );
};

export default AllCategory;
