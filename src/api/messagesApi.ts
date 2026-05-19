import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const messagesApi = createApi({
    reducerPath: 'messagesApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
        credentials: 'include',
    }),
    endpoints: (builder) => ({
        getConversations: builder.query<any[], void>({
            query: () => '/messages/getConversations',
        }),
        getMessages: builder.query<any[], number>({
            query: (conversationId) => `/messages/conversationGetMessages?conversationId=${conversationId}`,
        }),
        sendMessage: builder.mutation<any, { conversationId: number, text: string }>({
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
    }),
})

export const {
    useGetConversationsQuery,
    useGetMessagesQuery,
    useSendMessageMutation,
    useCreateConversationMutation,
} = messagesApi