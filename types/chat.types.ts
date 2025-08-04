import { Order } from "./order.types";
import { User, UserProfile } from "./user.types";

// Type for Chat model
export interface Chat {
  id: string;
  name?: string;
  type: ChatTypes;
  image?: string;
  description?: string;
  orderId?: string;
  createdAt: Date;
  updatedAt: Date;
  usersToChats: UserToChat[];
  messages: ChatMessage[];
  order?: Order;
}

// Type for Chat with unread messages count
export interface ChatWithUnreadCount extends Chat {
  totalUnreadMessages: number;
}

// Type for ChatRole model
export interface ChatRole {
  name: string;
  permissions: bigint;
  createdAt: Date;
  updatedAt: Date;
  usersToChats: UserToChat[];
}

// Type for ChatMessageAttachment model
export interface ChatMessageAttachment {
  id: string;
  messageId: string;
  location: string;
  filename?: string;
  createdAt: Date;
  updatedAt: Date;
  message: ChatMessage;
}

// Type for ChatMessage model
export interface ChatMessage {
  id: string;
  chatId: string;
  authorId: string;
  parentMessageId?: string;
  content: string;
  isPinned: boolean;
  status: ChatMessageStatuses;
  createdAt: Date;
  updatedAt: Date;
  removedAt?: Date;
  chat: Chat;
  author: User & {
    userProfile: UserProfile;
  };
  parentMessage?: ChatMessage;
  replies: ChatMessage[];
  attachments: ChatMessageAttachment[];
  reactions: ChatMessageReaction[];
}

// Type for ChatMessageReaction model
export interface ChatMessageReaction {
  messageId: string;
  userId: string;
  reaction: ChatMessageReactions;
  createdAt: Date;
  updatedAt: Date;
  chatMessage: ChatMessage;
  user: User;
}

// Type for UserToChat model
export interface UserToChat {
  chatId: string;
  userId: string;
  role: string;
  isArchived: boolean;
  lastSeenMessageTimestamp: Date;
  createdAt: Date;
  updatedAt: Date;
  chat: Chat;
  user: User;
  chatRole: ChatRole;
}

// Enum for ChatMessageReactions
export enum ChatMessageReactions {
  Like = "Like",
  Dislike = "Dislike",
  Laugh = "Laugh",
  Anger = "Anger",
  Heart = "Heart",
  Crying = "Crying"
}

// Enum for ChatMessageStatuses
export enum ChatMessageStatuses {
  Sent = "Sent",
  Read = "Read"
}

// Enum for ChatTypes
export enum ChatTypes {
  Private = "Private",
  Group = "Group",
  Supergroup = "Supergroup",
  Channel = "Channel"
}
