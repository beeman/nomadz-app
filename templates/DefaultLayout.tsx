import { ReactNode } from 'react';
import Footer from '../components/Footer';
import HeaderLayout from './HeaderLayout';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <HeaderLayout>
      <View className="flex flex-col min-h-screen">
        <main className="flex-grow max-xl:pb-[58px] xl:pb-24">
          {children}
        </main>
        <View>
          <Footer />
        </View>
      </View>
    </HeaderLayout>
  );
};

export default Layout;