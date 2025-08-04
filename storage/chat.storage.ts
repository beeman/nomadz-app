import { atom } from 'jotai';
import { api } from '../utils/api';
import { Chat, ChatRole, ChatMessage, ChatWithUnreadCount } from '../types/chat.types';
import { resolveUrl } from '../utils/app.utils';

// Atoms for storing chats data
export const chatsAtom = atom<Chat[] | ChatWithUnreadCount[]>([]);
export const chatMessagesAtom = atom<ChatMessage[]>([]);
export const chatRolesAtom = atom<ChatRole[]>([]);
export const chatsLoadingAtom = atom<boolean>(false);
export const chatRolesLoadingAtom = atom<boolean>(false);
export const chatErrorsAtom = atom<string | null>(null);
export const unreadChatsCountAtom = atom<number>(0);

export const selectedChatAtom = atom<Chat | null>(null);

// Function to calculate unread chats count
const calculateUnreadChatsCount = (chats: ChatWithUnreadCount[]) => {
  return chats.reduce((acc, chat) => {
    const hasUnreadMessages = chat.totalUnreadMessages > 0;
    return hasUnreadMessages ? acc + 1 : acc;
  }, 0);
};

// Function to update unread chats count
const updateUnreadChatsCount = (set: Function, chats: ChatWithUnreadCount[]) => {
  const unreadCount = calculateUnreadChatsCount(chats);
  set(unreadChatsCountAtom, unreadCount);
};

// Function to update total unread messages for a specific chat
export const updateChatUnreadMessagesAtom = atom(
  null,
  (get, set, {
    chatId,
    setValue,
    incrementBy
  }: {
    chatId: string;
    setValue?: number;
    incrementBy?: number;
  }) => {
    const chats = get(chatsAtom) as ChatWithUnreadCount[];
    const updatedChats = chats.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          totalUnreadMessages:
            Math.max(
              0,
              setValue !== undefined
              ? setValue
              : (incrementBy !== undefined
                ? chat.totalUnreadMessages + incrementBy
                : chat.totalUnreadMessages)
            )
        };
      }
      return chat;
    });

    set(chatsAtom, updatedChats);
    updateUnreadChatsCount(set, updatedChats);
  }
);

export const updateChatMessagesAtom = atom(
  null,
  (get, set, { 
    newMessage, 
    changeType, 
    oldMessageId 
  }: { 
    newMessage: ChatMessage; 
    changeType: 'add' | 'update' | 'delete';
    oldMessageId?: string; // Add this to support updating placeholder messages
  }) => {
    const messages = get(chatMessagesAtom);
    let updatedMessages;
    
    switch (changeType) {
      case 'add':
        updatedMessages = [...messages, newMessage];
        break;
      case 'update':
        updatedMessages = messages.map(msg => 
          msg.id === (oldMessageId || newMessage.id) ? newMessage : msg
        );
        break;
      case 'delete':
        updatedMessages = messages.filter(msg => msg.id !== newMessage.id);
        break;
      default:
        updatedMessages = messages;
    }

    set(chatMessagesAtom, updatedMessages);
  }
);

// Fetch all chats for a specific authorized user
export const fetchChatsAtom = atom(
  (get) => get(chatsAtom),
  async (get, set, { page = 1, ITEMS_PER_PAGE = 10 } = {}) => {
    set(chatsLoadingAtom, true);
    set(chatErrorsAtom, null);

    try {
      const response = await api.get('chats/list', {
        params: {
          take: ITEMS_PER_PAGE,
          skip: (page - 1) * ITEMS_PER_PAGE,
        },
      });

      const chats = response.data;
      updateUnreadChatsCount(set, chats);
      set(chatsAtom, response.data);
    } catch (error: any) {
      set(chatErrorsAtom, error.message);
    } finally {
      set(chatsLoadingAtom, false);
    }
  }
);

// Fetch chat messages by chat ID
export const fetchChatMessagesAtom = atom(
  (get) => get(chatMessagesAtom),
  async (get, set, chatId: string) => {
    set(chatsLoadingAtom, true);
    set(chatErrorsAtom, null);

    try {
      const url = resolveUrl(`chats/${chatId}/messages`, {
        include: {
          attachments: true,
          author: {
            include: {
              userProfile: true,
            }
          },
          parentMessage: {
            include: {
              attachments: true,
            }
          },
        },
        orderBy: {
          createdAt: 'asc',
        }
      });

      const response = await api.get(url);
      // const sortedMessages = [...response.data].sort((a, b) =>
      //   new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      // );
      // set(chatMessagesAtom, sortedMessages);
      set(chatMessagesAtom, response.data);
    } catch (error: any) {
      set(chatErrorsAtom, error.message);
    } finally {
      set(chatsLoadingAtom, false);
    }
  }
);

// Fetch all chat roles
export const fetchChatRolesAtom = atom(
  (get) => get(chatRolesAtom),
  async (get, set) => {
    set(chatRolesLoadingAtom, true);
    set(chatErrorsAtom, null);

    try {
      const response = await api.get('/chat-roles');
      set(chatRolesAtom, response.data);
    } catch (error: any) {
      set(chatErrorsAtom, error.message);
    } finally {
      set(chatRolesLoadingAtom, false);
    }
  }
);

// Atom for creating a chat
export const createChatAtom = atom(
  null,
  async (get, set, newChat: { name: string; type: string; description: string; orderId: string }) => {
    set(chatErrorsAtom, null);

    try {
      const response = await api.post('chats', {
        ...newChat,
      });
      const currentChats = get(chatsAtom);
      set(chatsAtom, [...currentChats, response.data]);
      return response.data;
    } catch (error: any) {
      set(chatErrorsAtom, error.message);
      throw error;
    }
  }
);

// Fetch single chat
export const fetchChatAtom = atom(
  (get) => get(selectedChatAtom),
  async (get, set, chatId: string) => {
    set(selectedChatAtom, null); // Reset the selected chat

    try {
      const url = resolveUrl(`chats/${chatId}`);
      const response = await api.get(url);

      if (response.status === 200) {
        set(selectedChatAtom, response.data);
      }
    } catch (error: any) {
      console.error('Failed to fetch chat:', error);
    }
  }
); 