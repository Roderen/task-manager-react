import { useEffect, useState } from 'react'
import { socket } from './useSocket'
import type { Task } from '@/types/task'
import {toast} from "sonner";
import {useSound} from "react-sounds";

export const useHelpNeeded = () => {
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

        socket.on('helpNeeded', onHelpNeeded)

        return () => {
            socket.off('helpNeeded', onHelpNeeded)
        }
    }, [])

    return helpTasks
}