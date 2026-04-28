import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {User} from "@/types/user.ts";

export const usersApi = createApi({
    reducerPath: 'usersApi',
    tagTypes: ['User'],
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000',
        credentials: 'include',
    }),
    endpoints: (builder) => ({
        getUser: builder.query<User, void>({
            query: () => ({
                url: '/users/me',
                method: 'GET'
            }),
            providesTags: ['User'],
        }),
        updateUser: builder.mutation({
            query(data) {
                const { name, avatar } = data
                return {
                    url: '/users/me',
                    method: 'PUT',
                    body: { name, avatar }
                }
            },
            invalidatesTags: ['User'],
        }),
    }),
})

export const { useGetUserQuery, useUpdateUserMutation } = usersApi