import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from '@headlessui/react';
import { Bars3Icon, ChevronLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { FC, ReactNode, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Menu from '../components/Header/Menu';
import TopNavigationBar from '../components/navigation/TopNavigationBar';
import Sidebar from '../components/Sidebar/Sidebar';
import { mobileSidebarNavigation } from '../constants/navigation';
import { PageHeadings } from '../enums/PageHeadings';
import HeaderLayout from './HeaderLayout';
interface SidebarLayoutProps {
  children: ReactNode;
  heading?: string;
  headingElement?: ReactNode;
  className?: string;
}

const SidebarLayout: FC<SidebarLayoutProps> = ({ children, heading, headingElement, className }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;
  const defaultHeading =
    PageHeadings[currentPath as keyof typeof PageHeadings] ||
    PageHeadings[`/${currentPath.split('/')[1]?.toString()}` as keyof typeof PageHeadings] ||
    '';

  return (
    <View className={`h-screen overflow-auto ${className || ''}`}>
      {/* Mobile sidebar */}
      <Dialog open={sidebarOpen} onClose={setSidebarOpen} className='relative z-50 lg:hidden'>
        <DialogBackdrop
          transition
          className='fixed inset-0 bg-black/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0'
        />

        <View className='flex fixed inset-0 flex-1'>
          <DialogPanel
            transition
            className='relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full'
          >
            <TransitionChild>
              <View className='absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0'>
                <button
                  type='button'
                  onClick={() => setSidebarOpen(false)}
                  className='-m-2.5 p-2.5'
                >
                  <Text className='sr-only'>close sidebar</Text>
                  <XMarkIcon className='w-6 h-6 text-white' aria-hidden='true' />
                </button>
              </View>
            </TransitionChild>
            <Sidebar navigation={mobileSidebarNavigation} />
          </DialogPanel>
        </View>
      </Dialog>

      {/* Mobile sidebar open button */}
      {/* <View className='fixed z-40 top-[22px] left-4 lg:hidden'>
        <button
          type='button'
          onClick={() => setSidebarOpen(true)}
          className='rounded-md bg-[#121212] p-2 text-white hover:bg-[#1f1f1f]'
        >
          <Text className='sr-only'>Open sidebar</Text>
          <Bars3Icon className='w-6 h-6' aria-hidden='true' />
        </button>
      </View> */}

      {/* Static sidebar for desktop */}
      {/* <View className='inset-y-0 hidden pt-[72px] pl-12 lg:fixed lg:flex w-72'>
        <Sidebar navigation={navigation} />
      </View> */}

      {/* Top navigation bar for desktop */}
      <View className="hidden w-full lg:block bg-black/0 lg:pt-[72px]">
        <TopNavigationBar />
      </View>

      {/* Main content */}
      <View>
        <HeaderLayout />

        <View className='flex items-center justify-between border-b border-[#444444] px-6 lg:hidden'>
          <button
            onClick={() => navigate(-1)}
            className='flex items-center p-2 text-white transition-colors rounded-full bg-[#323232]/50 size-8 2xl:size-9'
          >
            <ChevronLeftIcon className='size-5 2xl:size-6' />
          </button>
          {headingElement || heading || defaultHeading ? (
            <Text className='inline py-6 text-xl text-center text-white'>
              {headingElement || heading || defaultHeading}
            </Text>
          ) : (
            <View className='h-[76.55px]' />
          )}
          <Menu 
            button={
              <button
                type='button'
                className='rounded-xl bg-[#202020] p-1 text-white hover:bg-[#1f1f1f]'
              >
                <Text className='sr-only'>Open sidebar</Text>
                <Bars3Icon className='size-7' aria-hidden='true' />
              </button>
            }
          />
        </View>

        <main className='overflow-y-auto'>
          <View className="lg:hidden w-full bg-black/0 lg:pt-[72px]">
            <TopNavigationBar />
          </View>
          <View className='flex flex-col min-h-full p-4 lg:py-8 sm:px-6 max-lg:pb-[94px] lg:px-12 xl:px-20'>
            {children}
          </View>
        </main>
      </View>
    </View>
  );
};

export default SidebarLayout;
