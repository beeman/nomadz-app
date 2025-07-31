import { FC, PropsWithChildren } from 'react';

const AuthTemplate: FC<PropsWithChildren> = ({ children }) => {
  return (
    <View className='relative h-screen'>
      <View className='absolute inset-0'>
        <View className='absolute inset-0 bg-[#373737] opacity-50'>
          <View className='flex h-full bg-black'>
            <View className='h-1/2 w-full lg:h-full bg-[url("/images/backgrounds/world-map.png")] bg-cover bg-center lg:mt-0 mt-auto' />
          </View>
        </View>
      </View>
      <View className='relative z-10 flex justify-center h-full pt-16 md:items-center'>
        <View className="mx-auto">
          {children}
        </View>
      </View>
    </View>
  );
};

export default AuthTemplate; 