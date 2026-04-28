import React, {useState} from 'react'
import Header from '@/components/Header'
import TaskItem from '@/components/TaskItem'
import {useCreateTaskMutation, useDeleteTaskMutation, useGetTasksQuery, useUpdateTaskMutation} from "@/api/tasksApi.ts";
import {Spinner} from "@/components/ui/spinner.tsx";
import SearchTask from "@/pages/TasksPage/SearchTasks.tsx";
import {useDebounce} from "@/hooks/useDebaunce.ts";

const TasksPage = () => {
    const [filter, setFilter] = useState<'uncompleted' | 'completed'>('uncompleted')
    const [search, setSearch] = useState('')
    const debouncedSearch = useDebounce(search, 300)
    const [showNewTask, setShowNewTask] = useState(false)
    const [newTaskTitle, setNewTaskTitle] = useState('')

    const { data: tasks, isLoading} = useGetTasksQuery()
    const [createTask] = useCreateTaskMutation({})
    const [deleteTask] = useDeleteTaskMutation({})
    const [updateTask] = useUpdateTaskMutation({})

    const filteredTasks = tasks?.filter(task => {
        const matchesFilter = filter === 'completed' ? task.completed : !task.completed
        const matchesSearch = task.title.toLowerCase().includes(debouncedSearch.toLowerCase())
        return matchesFilter && matchesSearch
    }) ?? []

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        await createTask({ title: newTaskTitle });
        setNewTaskTitle("");
    }

    const handleDeleteTask = (taskId: number) => {
        deleteTask({ id: taskId })
    }

    const handleUpdateTask = (taskId: number, completed: boolean) => {
        updateTask({ id: taskId, completed: !completed })
    }

    const handleUpdateTitle = async (taskId: number, title: string) => {
        await updateTask({ id: taskId, title })
    }

    return (
        <div className="min-h-screen">
            <Header onNewTask={() => setShowNewTask(true)} />

            <div className="container mx-auto px-8 py-8">
                <SearchTask value={search} onChange={setSearch} />

                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setFilter('uncompleted')}
                        className={`px-4 py-2 rounded-lg font-medium ${filter === 'uncompleted' ? 'bg-black text-white' : 'text-gray-500'}`}
                    >
                        Uncompleted
                    </button>
                    <button
                        onClick={() => setFilter('completed')}
                        className={`px-4 py-2 rounded-lg font-medium ${filter === 'completed' ? 'bg-black text-white' : 'text-gray-500'}`}
                    >
                        Completed
                    </button>
                </div>

                {showNewTask && (
                    <form className="flex gap-3 mb-6" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            placeholder="Task title..."
                            className="flex-1 border rounded-lg px-4 py-2"
                            required
                        />
                        <button type="submit" className="bg-black text-white px-4 py-2 rounded-lg">Add</button>
                        <button type="button" onClick={() => setShowNewTask(false)}
                                className="text-gray-500 px-4 py-2">Cancel
                        </button>
                    </form>
                )}

                <div className="flex flex-col gap-3">
                    {isLoading ? (
                        <div className="w-100% flex justify-center items-center">
                            <Spinner className="size-8"/>
                        </div>
                    ) : filteredTasks.length > 0 ? (
                        filteredTasks.map((task) => (
                            <TaskItem
                                key={task.id}
                                id={task.id}
                                title={task.title}
                                completed={task.completed}
                                onToggle={() => handleUpdateTask(task.id, task.completed)}
                                onDelete={() => handleDeleteTask(task.id)}
                                onEdit={(id, title) => handleUpdateTitle(id, title)}
                                createdAt={task.createdAt}
                            />
                        ))
                    ) : (
                        <div className="text-gray-400 text-center py-8">No tasks yet</div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TasksPage