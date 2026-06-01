import type { Conversation, Message } from '@/types/messages'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

type MessagesResponse = {
  messages: Message[]
  interlocutorLastReadMessageId: number
  nextCursor: number | null
  interlocutorMember: any
}

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
    getMessages: builder.infiniteQuery<MessagesResponse, number, number | null>({
      infiniteQueryOptions: {
        initialPageParam: null as number | null,
        getNextPageParam: (lastPage: MessagesResponse) => lastPage.nextCursor ?? undefined,
      },
      query: ({ queryArg: conversationId, pageParam }) => ({
        url: `/messages/conversationGetMessages`,
        params: {
          conversationId,
          cursor: pageParam ?? undefined,
          limit: 20,
        },
      }),
      providesTags: ['Messages'],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled
        dispatch(messagesApi.util.invalidateTags(['Conversations']))
      },
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
      }),
      invalidatesTags: ['Messages'],
    }),
    editMessage: builder.mutation<Message, { messageId: number, text: string }>({
      query: ({ messageId, text }) => ({
        url: `/messages/editConversationMessage/${messageId}`,
        method: 'PUT',
        body: { text },
      }),
      invalidatesTags: ['Messages'],
    }),
    markAsRead: builder.mutation<void, { conversationId: number, messageId: number }>({
      query: (body) => ({
        url: '/messages/markAsRead',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Conversations'], // ← добавь
    }),
  }),
})

export const {
  useGetConversationsQuery,
  useGetMessagesInfiniteQuery,
  useSendMessageMutation,
  useCreateConversationMutation,
  useDeleteMessageMutation,
  useEditMessageMutation,
  useMarkAsReadMutation
} = messagesApi
