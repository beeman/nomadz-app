import { FC, ReactNode } from 'react';
import FetchUser from '../components/Auth/FetchUser';
import Header from '../components/Header';
import MobileNavBar from '../components/navigation/MobileNavBar';

interface HeaderLayoutProps {
  children?: ReactNode;
}
const HeaderLayout: FC<HeaderLayoutProps> = ({ children }) => {
  return (
    <FetchUser>
      <>
        <View className="hidden lg:block">
          <Header />
        </View>
        <View className="lg:hidden">
          <MobileNavBar />
        </View>
        <View>
          {children}
        </View>
      </>
    </FetchUser>
  );
};

export default HeaderLayout;
