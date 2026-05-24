import type { Conversation, Message } from '@/types/messages'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const messagesApi = createApi({
  reducerPath: 'messagesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include',
  }),
  tagTypes: ['Conversations', 'Messages'],
  endpoints: (builder) => ({
    getConversations: builder.query<Conversation[], void>({
      query: () => '/messages/getConversations',
      providesTags: ['Conversations']
    }),
    getMessages: builder.query<{ messages: Message[], interlocutorLastReadMessageId: number }, number>({
      query: (conversationId) => `/messages/conversationGetMessages?conversationId=${conversationId}`,
      providesTags: ['Messages'],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled
        dispatch(messagesApi.util.invalidateTags(['Conversations']))
      }
    }),
    sendMessage: builder.mutation<Message, { conversationId: number, text: string }>({
      query: (body) => ({
        url: '/messages/conversationSendMessage',
        method: 'POST',
        body,
      }),
    }),
    createConversation: builder.mutation<{ conversationId: number }, { receiverId: number }>({
      query: (body) => ({
        url: '/messages/conversation',
        method: 'POST',
        body,
      }),
    }),
    deleteMessage: builder.mutation<Message, { messageId: number }>({
      query: (body) => ({
        url: `/messages/deleteConversationMessage/${body.messageId}`,
        method: 'DELETE'
      })
    }),
    editMessage: builder.mutation<Message, { messageId: number, text: string }>({
      query: ({ messageId, text }) => ({
        url: `/messages/editConversationMessage/${messageId}`,
        method: 'PUT',
        body: { text },
      }),
      invalidatesTags: ['Messages'],
    }),
  }),
})

export const {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useCreateConversationMutation,
  useDeleteMessageMutation,
  useEditMessageMutation
} = messagesApi
