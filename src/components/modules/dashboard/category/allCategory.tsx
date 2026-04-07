import { Card } from '@/components/ui/card';
import { categoryService } from '@/services/category.service';
import { PenIcon } from 'lucide-react';
import Image from 'next/image';

type category = {
  id: string;
  name: string;
  coverImg: string;
  createdAt: Date;
  updatedAt: Date;
};

const AllCategory = async () => {
  const categories = await categoryService.getAllCategory();
  console.log(categories);

  return (
    <div className="grid grid-cols-6 gap-3">
      {categories?.map((category: category) => (
        <Card
          key={category.id}
          className="flex flex-col justify-center items-center relative"
        >
          <span className="absolute top-3 right-3  hover:bg-white/25  p-1 rounded-full">
            <PenIcon className="" size={18} />
          </span>
          <div className="w-36 h-34 bg-white rounded-full overflow-hidden">
            <Image
              src={category.coverImg}
              alt={category.name as string}
              width={500}
              height={500}
              className="w-full h-full"
              priority
            />
          </div>
          <p className="text-xl font-bold">{category.name}</p>
        </Card>
      ))}
    </div>
  );
};

export default AllCategory;
