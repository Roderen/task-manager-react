import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { User } from "@/types/user.ts";

export const usersApi = createApi({
  reducerPath: 'usersApi',
  tagTypes: ['User'],
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getUser: builder.query<User | null, void>({
      query: () => ({
        url: '/users/me',
        method: 'GET'
      }),
      providesTags: ['User'],
    }),
    updateUser: builder.mutation<User | null, { name: string, avatar: string }>({
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
