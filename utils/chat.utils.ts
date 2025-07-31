import { ChatMessageAttachment } from "../types/chat.types";

export const getChatAttachmentUrl = (attachment: ChatMessageAttachment) => {
  const realUrl = attachment.location.startsWith('blob:')
    ? attachment.location
    : `${process.env.SUPABASE_PUBLIC_URL}/${attachment.location}`;

  return realUrl;
};