import { FC, ReactNode } from 'react';

interface ImagePreviewProps {
  image?: File;
  imageUrl?: string;
  onChangeClick: () => void;
  className?: string;
  imageClassName?: string;
  overlayElement?: ReactNode;
}

const ImagePreview: FC<ImagePreviewProps> = ({
  image,
  imageUrl,
  onChangeClick,
  className = '',
  imageClassName = '',
  overlayElement,
}) => {
  const src = image ? URL.createObjectURL(image) : imageUrl;

  return (
    <div className={`relative group rounded-lg ${className}`}>
      {src && (
        <img
          src={src}
          alt='Image preview'
          className={`w-full h-full object-cover ${imageClassName}`}
          style={{ borderRadius: 'inherit' }}
        />
      )}
      <div className='absolute inset-0 flex items-center justify-center w-full h-full transition-opacity duration-300 opacity-0 bg-black/50 group-hover:opacity-100' style={{ borderRadius: 'inherit' }}>
        {overlayElement ? (
          <div onClick={e => { e.preventDefault(); onChangeClick(); }} className='contents'>
            {overlayElement}
          </div>
        ) : (
          <button
            className='px-4 py-2 text-sm text-white border border-white rounded-full hover:bg-white hover:text-black'
            onClick={e => {
              e.preventDefault();
              onChangeClick();
            }}
          >
            Change image
          </button>
        )}
      </div>
    </div>
  );
};

export default ImagePreview; 