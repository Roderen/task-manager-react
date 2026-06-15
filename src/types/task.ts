export interface Task {
  id: number
  userId: number
  title: string
  needsHelp: boolean
  completed: boolean
  search: string
  createdAt: Date
  user: { email: string }
}

export interface TasksResponse {
  data: Task[]
  total: number
  page: number
  limit: number
  totalPages: number
}
