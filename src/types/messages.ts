import type { User } from "./user"

export interface Conversation {
  conversationId: number
  interlocutorId: number
  interlocutorName: string | null
  interlocutorAvatar: string | null
  interlocutorEmail: string
  unreadCount: number
}

export interface Message {
  id: number
  conversationId: number
  sender?: User
  senderId: number
  text: string
  createdAt: string
  editedAt: string | null
  deletedAt: string | null
}
