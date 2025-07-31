import React from 'react';
import { AddImageIcon } from '../icons/Icons';

interface AvatarUploadProps {
  image: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ image, onImageChange }) => {
  return (
    <label className="w-[108px] h-[108px] border border-dashed border-[#4C535F] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-white/60">
      <input
        type="file"
        className="hidden"
        accept="image/*"
        onChange={onImageChange}
      />
      {image ? (
        <img
          src={`${import.meta.env.VITE_SUPABASE_PUBLIC_URL}/${image}`}
          alt="Profile preview"
          className="object-cover w-full h-full rounded-lg"
        />
      ) : (
        <>
          <AddImageIcon />
          <span className="mt-2 text-[10.06px] text-center">Upload your<br />photo</span>
        </>
      )}
    </label>
  );
};

export default AvatarUpload; 