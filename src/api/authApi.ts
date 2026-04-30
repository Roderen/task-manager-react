import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000',
        credentials: 'include',
    }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials: { email: string; password: string }) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            })
        }),
        register: builder.mutation({
            query: (credentials: { email: string; password: string }) => ({
                url: '/auth/register',
                method: 'POST',
                body: credentials,
            }),
        }),
        checkToken: builder.query<{ id: number; email: string }, void>({
            query: () => ({
                url: '/auth/checkToken',
                method: 'GET'
            }),
        }),
        changePasswordRequest: builder.mutation({
            query: (credentials: { newPassword: string }) => ({
                url: '/auth/change-password/request',
                method: 'POST',
                body: credentials,
            })
        }),
        changePasswordConfirm: builder.mutation({
            query: (credentials: { code: string }) => ({
                url: '/auth/change-password/confirm',
                method: 'POST',
                body: credentials,
            })
        })
    }),
})

export const {
    useLoginMutation,
    useLogoutMutation,
    useRegisterMutation,
    useCheckTokenQuery,
    useChangePasswordRequestMutation,
    useChangePasswordConfirmMutation
} = authApi