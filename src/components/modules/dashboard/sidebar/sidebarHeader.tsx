import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { Button } from '@/components/ui/button';
import { Bell, BookmarkIcon } from 'lucide-react';
import { BreadcrumbBasic } from './breadcame';

const Header = () => {
  return (
    <header>
      <div className="ml-auto flex justify-between items-center gap-1 border-b border-gray-500/10 h-16 px-4">
        <BreadcrumbBasic />
        <div className="ml-auto flex justify-center items-center gap-1">
          <AnimatedThemeToggler />
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <BookmarkIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
