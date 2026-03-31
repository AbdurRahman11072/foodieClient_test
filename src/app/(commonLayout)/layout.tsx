import { Navbar1 } from '@/components/modules/home/navbar1';

const commonLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <Navbar1 />
      {children}
    </main>
  );
};

export default commonLayout;
