import { ReactNode } from 'react';
import { HouseCrossIcon } from '../icons/Icons';

interface EmptyStateProps {
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  icon?: ReactNode;
}

const EmptyState = ({
  title = "oops, no results found!",
  description = "we couldn't find any apartments matching your search. try adjusting your filters or head back to the homepage to explore more options.",
  children,
  className = '',
  icon
}: EmptyStateProps) => {
  return (
    <View className={`flex flex-col items-center justify-center px-4 ${className}`}>
      <View className="relative size-16 [&>*]:size-full text-white">
        {icon || <HouseCrossIcon />}
      </View>
      
      <Text className="mt-6 mb-4 text-2xl font-semibold text-white">
        {title}
      </Text>
      
      <Text className="max-w-sm text-sm text-center text-white 2xl:text-base">
        {description}
      </Text>

      {children}
    </View>
  );
};

export default EmptyState;