import React, { useRef } from 'react';
import { DEFAULT_AVATAR_PATH } from '../../constants/paths';
import { handleAvatarError } from '../../utils/image.utils';

interface AvatarProps {
  image?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'unset' | string;
  className?: string;
  altText?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  image,
  size = 'unset',
  className = '',
  altText = 'Avatar',
}) => {
  const isDefaultAvatar = useRef(false);

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-[60px] h-[60px]',
    lg: 'w-[108px] h-[108px]',
    unset: 'w-full h-full',
  };

  const sizeClass = sizeClasses[size as keyof typeof sizeClasses] || `${size}`;

  return (
    <div className={`overflow-hidden rounded-full ${sizeClass} ${className}`}>
      <img
        src={
          image
            ? `${import.meta.env.VITE_SUPABASE_PUBLIC_URL}${image}`
            : DEFAULT_AVATAR_PATH
        }
        alt={altText}
        className='flex object-cover items-center w-full h-full text-center text-white truncate align-middle'
        onError={e => handleAvatarError(e, { useRef: isDefaultAvatar })}
      />
    </div>
  );
};

export default Avatar;
