import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const messagesApi = createApi({
    reducerPath: 'messagesApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
        credentials: 'include',
    }),
    tagTypes: ['Conversations'],
    endpoints: (builder) => ({
        getConversations: builder.query<any[], void>({
            query: () => '/messages/getConversations',
            providesTags: ['Conversations']
        }),
        getMessages: builder.query<{ messages: any[], interlocutorLastReadMessageId: number }, number>({
            query: (conversationId) => `/messages/conversationGetMessages?conversationId=${conversationId}`,
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                await queryFulfilled
                dispatch(messagesApi.util.invalidateTags(['Conversations']))
            }
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
        deleteMessage: builder.mutation({
            query: (body) => ({
                url: `/messages/deleteConversationMessage/${body.messageId}`,
                method: 'DELETE',
                body
            })
        })
    }),
})

export const {
    useGetConversationsQuery,
    useGetMessagesQuery,
    useSendMessageMutation,
    useCreateConversationMutation,
    useDeleteMessageMutation,
} = messagesApi