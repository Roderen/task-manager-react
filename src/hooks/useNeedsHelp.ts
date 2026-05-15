import { useEffect, useState } from 'react'
import { socket } from './useSocket'
import type { Task } from '@/types/task'
import {toast} from "sonner";
import {useSound} from "react-sounds";

export const useHelpNeeded = (onCancel?: (taskId: number) => void) => {
    const [helpTasks, setHelpTasks] = useState<Task[]>([])
    const {play} = useSound('notification/info', {
        volume: 0.3
    })

    useEffect(() => {
        function onHelpNeeded(task: Task) {
            setHelpTasks(prev => [...prev, task])
            toast(`"${task.title}" needs help!`)
            play()
        }

        function onHelpCanceled(taskId: number) {
            setHelpTasks(prev => prev.filter(t => t.id !== taskId))
            onCancel?.(taskId)
        }

        socket.on('helpNeeded', onHelpNeeded)
        socket.on('helpCancelNeeded', onHelpCanceled)

        return () => {
            socket.off('helpNeeded', onHelpNeeded)
            socket.off('helpCancelNeeded', onHelpCanceled)
        }
    }, [])

    const removeTask = (taskId: number) => {
        setHelpTasks(prev => prev.filter(t => t.id !== taskId))
    }

    return { helpTasks, removeTask }
}