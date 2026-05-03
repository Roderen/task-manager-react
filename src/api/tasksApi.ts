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
        getTasks: builder.query<{ data: Task[], total: number, page: number, limit: number, totalPages: number }, { page: number, limit: number, completed?: boolean }>({
            query: ({ page, limit, completed }) => ({
                url: '/tasks',
                method: 'GET',
                params: { page, limit, completed }
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
        getTasksCount: builder.query<{ total: number; completed: number; uncompleted: number }, void>({
            query: () => ({
                url: '/tasks/count',
                method: 'GET'
            }),
            providesTags: ['Task'],
        }),
    }),
})

export const { useGetTasksQuery, useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation, useGetTasksCountQuery } = tasksApi