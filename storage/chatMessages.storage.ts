import { atom } from 'jotai';
import { api } from '../utils/api';
import { chatMessagesAtom } from './chat.storage'; // Import from chat.storage.ts
import { ChatMessage, ChatMessageAttachment } from '../types/chat.types';
import _ from 'lodash';

// Atoms for storing chat messages data
export const chatMessagesLoadingAtom = atom<boolean>(false);
export const chatMessagesErrorsAtom = atom<string | null>(null);

// Atom for storing chat message attachments
export const chatMessageAttachmentsAtom = atom<ChatMessageAttachment[]>([]);
export const chatMessageAttachmentsLoadingAtom = atom<boolean>(false);
export const chatMessageAttachmentsErrorsAtom = atom<string | null>(null);

// Fetch chat messages by chat ID
export const fetchChatMessagesAtom = atom(
  (get) => get(chatMessagesAtom),
  async (get, set, chatId: string) => {
    set(chatMessagesLoadingAtom, true);
    set(chatMessagesErrorsAtom, null);

    try {
      const response = await api.get(`chat-messages/${chatId}`);
      set(chatMessagesAtom, response.data);
    } catch (error: any) {
      set(chatMessagesErrorsAtom, error.message);
    } finally {
      set(chatMessagesLoadingAtom, false);
    }
  }
);

// Atom for creating a chat message
export const createChatMessageAtom = atom(
  null,
  async (get, set, newMessage: FormData) => {
    set(chatMessagesErrorsAtom, null);

    try {
      const { data } = await api.post('chat-messages', newMessage);
      return data
    } catch (error: any) {
      set(chatMessagesErrorsAtom, error.message);
      throw error;
    }
  }
);

// Atom for updating a chat message
export const updateChatMessageAtom = atom(
  null,
  async (get, set, updatedMessage: ChatMessage) => {
    set(chatMessagesErrorsAtom, null);

    try {
      const response = await api.put(`chat-messages/${updatedMessage.id}`, {
        content: updatedMessage.content
      });
      const currentMessages = get(chatMessagesAtom);
      const updatedMessages = currentMessages.map((msg) =>
        msg.id === updatedMessage.id ? response.data : msg
      );
      set(chatMessagesAtom, updatedMessages);
    } catch (error: any) {
      set(chatMessagesErrorsAtom, error.message);
      throw error;
    }
  }
);

// Fetch chat message attachments by message ID
export const fetchChatMessageAttachmentsAtom = atom(
  (get) => get(chatMessageAttachmentsAtom),
  async (get, set, messageId: string) => {
    set(chatMessageAttachmentsLoadingAtom, true);
    set(chatMessageAttachmentsErrorsAtom, null);

    try {
      const response = await api.get(`/api/v1/chat-messages/${messageId}/attachments`);
      set(chatMessageAttachmentsAtom, response.data);
    } catch (error: any) {
      set(chatMessageAttachmentsErrorsAtom, error.message);
    } finally {
      set(chatMessageAttachmentsLoadingAtom, false);
    }
  }
);

// Add this atom for deleting messages
export const deleteChatMessageAtom = atom(
  null,
  async (get, set, messageId: string) => {
    try {
      await api.delete(`chat-messages/${messageId}`);
      set(chatMessagesAtom, get(chatMessagesAtom).filter(msg => msg.id !== messageId));
    } catch (error) {
      console.error('Failed to delete message:', error);
      throw error;
    }
  }
); 