import { useAtom } from 'jotai';
import {
  fetchChatMessagesAtom,
  chatMessagesLoadingAtom,
  chatMessagesErrorsAtom,
  createChatMessageAtom,
  updateChatMessageAtom,
  fetchChatMessageAttachmentsAtom,
  deleteChatMessageAtom,
} from '../storage/chatMessages.storage';

export const useChatMessages = () => {
  const [chatMessages, fetchChatMessages] = useAtom(fetchChatMessagesAtom);
  const [isLoadingChatMessages] = useAtom(chatMessagesLoadingAtom);
  const [errors] = useAtom(chatMessagesErrorsAtom);
  const [, createChatMessage] = useAtom(createChatMessageAtom);
  const [, updateChatMessage] = useAtom(updateChatMessageAtom);
  const [, fetchChatMessageAttachments] = useAtom(fetchChatMessageAttachmentsAtom);
  const [, deleteChatMessage] = useAtom(deleteChatMessageAtom);

  return {
    chatMessages,
    isLoadingChatMessages,
    errors,
    fetchChatMessages,
    createChatMessage,
    updateChatMessage,
    fetchChatMessageAttachments,
    deleteChatMessage,
  };
}; 