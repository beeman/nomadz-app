import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Bucket name for nomad cards
export const NOMAD_CARDS_BUCKET = import.meta.env.VITE_SUPABASE_BUCKET_NAME;

// Function to upload profile card image
export const uploadProfileCard = async (userId: string, imageBlob: Blob): Promise<string> => {
  const fileName = `nomad-cards/${userId}/profile-card.png`;

  const { data, error } = await supabase.storage
    .from(NOMAD_CARDS_BUCKET)
    .upload(fileName, imageBlob, {
      upsert: true,
      contentType: 'image/png'
    });

  if (error) {
    throw new Error(`Failed to upload profile card: ${error.message}`);
  }

  return fileName;
};

// Function to get profile card URL
export const getProfileCardUrl = (userId: string): string => {
  return `${import.meta.env.VITE_SUPABASE_PUBLIC_URL}nomad-cards/${userId}/profile-card.png`;
}; 