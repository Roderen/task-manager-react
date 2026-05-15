import { useEffect, useState } from 'react'
import { socket } from './useSocket'
import { tasksApi } from '@/api/tasksApi'
import type { Task } from '@/types/task'
import { toast } from 'sonner'
import { useSound } from 'react-sounds'
import {useAppDispatch} from "@/store/store.ts";

export const useHelpNeeded = (page: number, limit: number) => {
    const dispatch = useAppDispatch()
    const [helpTasks, setHelpTasks] = useState<Task[]>([])
    const { play } = useSound('notification/info', { volume: 0.3 })

    useEffect(() => {
        function onHelpNeeded(task: Task) {
            setHelpTasks(prev => [...prev, task])
            toast(`"${task.title}" needs help!`)
            play()
        }

        function onHelpCanceled(taskId: number) {
            setHelpTasks(prev => prev.filter(t => t.id !== taskId))
            dispatch(tasksApi.util.updateQueryData('getHelpTasks', { page, limit }, (draft) => {
                draft.data = draft.data.filter(t => t.id !== taskId)
            }))
        }

        socket.on('helpNeeded', onHelpNeeded)
        socket.on('helpCancelNeeded', onHelpCanceled)

        return () => {
            socket.off('helpNeeded', onHelpNeeded)
            socket.off('helpCancelNeeded', onHelpCanceled)
        }
    }, [])

    return { helpTasks }
}