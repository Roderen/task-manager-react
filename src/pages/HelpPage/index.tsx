import {useState} from 'react'
import Header from '@/components/Header'
import TaskItem from '@/components/TaskItem'
import {useDeleteTaskMutation, useGetHelpTasksQuery, useUpdateTaskMutation} from "@/api/tasksApi.ts";
import {Spinner} from "@/components/ui/spinner.tsx";
import {useHelpNeeded} from "@/hooks/useNeedsHelp.ts";
import {useGetUserQuery} from "@/api/usersApi.ts";

const HelpPage = () => {
    const {data: currentUser} = useGetUserQuery()
    const [page, setPage] = useState<number>(1);
    const limit = 10

    const {data: tasks, isLoading} = useGetHelpTasksQuery({ page, limit })
    const [deleteTask] = useDeleteTaskMutation({})
    const [updateTask] = useUpdateTaskMutation({})

    const { helpTasks: realtimeTasks } = useHelpNeeded(page, limit)

    const allTasks = [...realtimeTasks, ...(tasks?.data ?? [])]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    const handleDeleteTask = (taskId: number) => {
        deleteTask({id: taskId})
    }

    const handleUpdateTask = (taskId: number, completed: boolean) => {
        updateTask({id: taskId, completed: !completed})
    }

    const handleUpdateTitle = async (taskId: number, title?: string, needsHelp?: boolean) => {
        await updateTask({ id: taskId, title, needsHelp })
    }

    return (
        <div className="min-h-screen">
            <Header/>
            <div className="container mx-auto px-8 py-8">
                <div className="flex flex-col gap-3">
                    {isLoading ? (
                        <div className="w-100% flex justify-center items-center">
                            <Spinner className="size-8"/>
                        </div>
                    ) : allTasks.length > 0 ? (
                        allTasks.map((task) => (
                            <TaskItem
                                key={task.id}
                                id={task.id}
                                userId={task.userId}
                                currentUserId={currentUser?.id}
                                needsHelp={task.needsHelp}
                                title={task.title}
                                completed={task.completed}
                                onToggle={() => handleUpdateTask(task.id, task.completed)}
                                onDelete={() => handleDeleteTask(task.id)}
                                onEdit={(id, title, needsHelp) => handleUpdateTitle(id, title, needsHelp)}
                                createdAt={task.createdAt}
                            />
                        ))
                    ) : (
                        <div className="text-gray-400 text-center py-8">No tasks yet</div>
                    )}

                    {tasks && tasks.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-6">
                            <button
                                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                disabled={page === 1}
                                className="px-4 py-2 rounded-lg border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            {Array.from({ length: tasks.totalPages }, (_, i) => i + 1)
                                .filter(p => p >= page - 1 && p <= page + 2)
                                .map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        className={`px-4 py-2 rounded-lg border ${page === p ? 'bg-black text-white' : 'hover:bg-gray-50'}`}
                                    >
                                        {p}
                                    </button>
                                ))
                            }
                            <button
                                onClick={() => setPage(prev => Math.min(prev + 1, tasks.totalPages))}
                                disabled={page === tasks.totalPages}
                                className="px-4 py-2 rounded-lg border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default HelpPage