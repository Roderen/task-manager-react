import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {Task} from "@/types/task.ts";

export const tasksApi = createApi({
    reducerPath: 'tasksApi',
    tagTypes: ['Task'],
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000',
        credentials: 'include',
    }),
    endpoints: (builder) => ({
        getTasks: builder.query<Task[], void>({
            query: () => ({
                url: '/tasks',
                method: 'GET'
            }),
            providesTags: ['Task'],
        }),
        createTask: builder.mutation({
            query(data) {
                const { title } = data
                return {
                    url: "/tasks",
                    method: 'POST',
                    body: { title }
                }
            },
            invalidatesTags: ['Task'],
        }),
        updateTask: builder.mutation({
            query(data) {
                const { id, completed, title } = data
                return {
                    url: `/tasks/${id}`,
                    method: 'PUT',
                    body: { completed, title }
                }
            },
            invalidatesTags: ['Task'],
        }),
        deleteTask: builder.mutation({
            query(data) {
                const { id } = data
                return {
                    url: `/tasks/${id}`,
                    method: 'DELETE',
                }
            },
            invalidatesTags: ['Task'],
        }),
    }),
})

export const { useGetTasksQuery, useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } = tasksApi