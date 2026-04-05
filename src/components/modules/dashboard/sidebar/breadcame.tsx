'use client';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { usePathname } from 'next/navigation';

export function BreadcrumbBasic() {
  const pathname = usePathname();

  const allPath = pathname.split('/').filter((sigment) => sigment);
  const currentIndex = allPath.length - 1;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {allPath.map((crumbs, index) => (
          <div key={crumbs} className="flex  justify-center items-center">
            <BreadcrumbItem className="capitalize">{crumbs}</BreadcrumbItem>
            {index !== currentIndex && <BreadcrumbSeparator className="pl-3" />}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
