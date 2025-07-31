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
    <div
      className={`overflow-hidden rounded-xl bg-[#161616] flex flex-col ${className}`}
      onClick={() => onClick?.()}
    >
      <div className='w-full h-[70%] overflow-hidden'>
        <img loading="lazy" src={image} alt={title} className={`object-cover w-full h-full ${imageClassName}`} />
      </div>
      <div className={`h-[30%] flex flex-col justify-center px-3.5 ${contentClassName}`}>
        <p className={`text-white ${titleClassName}`}>{title}</Text>
        <div className={`text-[#8A8A8A] ${descriptionClassName}`}>{description}</div>
      </div>
    </div>
  );
};

export default Card;
