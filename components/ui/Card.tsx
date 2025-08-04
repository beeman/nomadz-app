import { FC } from 'react';

interface CardProps {
  image: string;
  title: string;
  description: string;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  contentClassName?: string;
  imageClassName?: string;
  onClick?: (...args: any[]) => void;
}

const Card: FC<CardProps> = ({
  image,
  title,
  description,
  className = '',
  titleClassName = 'text-sm',
  descriptionClassName = 'text-xs',
  contentClassName = '',
  imageClassName = '',
  onClick,
}) => {
  return (
    <View
      className={`overflow-hidden rounded-xl bg-[#161616] flex flex-col ${className}`}
      onClick={() => onClick?.()}
    >
      <View className='w-full h-[70%] overflow-hidden'>
        <Image loading="lazy" src={image} alt={title} className={`object-cover w-full h-full ${imageClassName}`} />
      </View>
      <View className={`h-[30%] flex flex-col justify-center px-3.5 ${contentClassName}`}>
        </Text className={`text-white ${titleClassName}`}>{title}</Text>
        <View className={`text-[#8A8A8A] ${descriptionClassName}`}>{description}</View>
      </View>
    </View>
  );
};

export default Card;
