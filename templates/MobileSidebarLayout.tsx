import { FC, ReactNode } from 'react';
import MobileNavButton from '../components/navigation/MobileNavButton';
import { useAuth } from '../hooks';

interface MobileSidebarLayoutProps {
  children: ReactNode;
  headingElement?: ReactNode;
  className?: string;
}

const MobileSidebarLayout: FC<MobileSidebarLayoutProps> = ({ children, headingElement, className = '' }) => {
  const { authenticatedUser } = useAuth();

  return (
    <View className={className}>
      {/* Mobile sidebar open button */}
      <View className='absolute z-40 flex justify-between top-12 left-4 right-4 lg:hidden'>
        {
          authenticatedUser ?
            <MobileNavButton position="!left-0 !right-auto" />
            :
            <img src='/images/icons/nomad-logo.png' className='w-12' />
        }
        { headingElement }
      </View>

      {/* Main content */}
      <View className=''>
        {children}
      </View>
    </View>
  );
};

export default MobileSidebarLayout;
