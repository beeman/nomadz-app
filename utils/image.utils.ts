import { AppConfig } from '../constants/app-config';
import { DEFAULT_AVATAR_PATH } from '../constants/paths';

interface HandleAvatarErrorOptions {
  useRef?: React.MutableRefObject<boolean>;
}

export const handleAvatarError = (e: React.SyntheticEvent<HTMLImageElement, Event>, options?: HandleAvatarErrorOptions) => {
  const img = e.currentTarget;

  if (options?.useRef) {
    if (!options.useRef.current || img.src != DEFAULT_AVATAR_PATH) {
      options.useRef.current = true;
      img.src = DEFAULT_AVATAR_PATH;
    } else {
      // If default avatar also fails to load, show a fallback UI
      img.style.display = 'none';
      img.parentElement?.classList.add('bg-gray-700');
    }
  } else {
    if (img.src !== DEFAULT_AVATAR_PATH) {
      img.src = DEFAULT_AVATAR_PATH;
    } else {
      // If default avatar also fails to load, show a fallback UI
      img.style.display = 'none';
      img.parentElement?.classList.add('bg-gray-700');
    }
  }
};

/**
 * Builds a complete image URL using the AppConfig.imageBase prefix
 * @param imagePath - The relative image path from storage
 * @returns Complete image URL
 */
export const getImageUrl = (imagePath: string | null | undefined): string | null => {
  if (!imagePath) return null;
  return `${AppConfig.imageBase}${imagePath}`;
}; 