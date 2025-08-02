import { useAtom } from 'jotai';
import {
  fetchChatsAtom,
  fetchChatMessagesAtom,
  fetchChatRolesAtom,
  chatsLoadingAtom,
  chatRolesLoadingAtom,
  chatErrorsAtom,
  createChatAtom,
  fetchChatAtom,
  updateChatMessagesAtom,
  unreadChatsCountAtom,
  updateChatUnreadMessagesAtom
} from '../storage/chat.storage';
import { ChatMessage, ChatMessageStatuses } from '../types/chat.types';

export const useChats = () => {
  const [chats, fetchChats] = useAtom(fetchChatsAtom);
  const [chatMessages, fetchChatMessages] = useAtom(fetchChatMessagesAtom);
  const [chatRoles, fetchChatRoles] = useAtom(fetchChatRolesAtom);
  const [isLoadingChats] = useAtom(chatsLoadingAtom);
  const [isLoadingChatRoles] = useAtom(chatRolesLoadingAtom);
  const [errors] = useAtom(chatErrorsAtom);
  const [, createChat] = useAtom(createChatAtom);
  const [selectedChat, fetchChat] = useAtom(fetchChatAtom);
  const [, updateChatMessages] = useAtom(updateChatMessagesAtom);
  const [unreadChatsCount] = useAtom(unreadChatsCountAtom);
  const [, updateChatUnreadMessages] = useAtom(updateChatUnreadMessagesAtom);

  const markMessageAsRead = (message: ChatMessage) => {
    updateChatMessages({
      newMessage: { ...message, status: ChatMessageStatuses.Read },
      changeType: 'update'
    });
    updateChatUnreadMessages({
      chatId: message.chatId,
      incrementBy: -1
    });
  };

  return {
    chats,
    chatMessages,
    chatRoles,
    isLoadingChats,
    isLoadingChatRoles,
    errors,
    fetchChats,
    fetchChatMessages,
    fetchChatRoles,
    createChat,
    selectedChat,
    fetchChat,
    updateChatMessages,
    unreadChatsCount,
    markMessageAsRead,
    updateChatUnreadMessages
  };
}; 