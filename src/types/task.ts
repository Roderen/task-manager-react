export interface Task {
    id: number
    userId: number
    title: string
    completed: boolean
    createdAt: Date
}

export interface TasksResponse {
    data: Task[]
    total: number
    page: number
    limit: number
    totalPages: number
}