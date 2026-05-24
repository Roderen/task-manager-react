import { useEffect } from 'react'
import { socket } from './useSocket'
import { toast } from 'sonner'
import { useSound } from 'react-sounds'
import { useDispatch } from 'react-redux'
import { messagesApi } from "@/api/messagesApi.ts"

export const useGotMessage = (isConnected: boolean) => {
  const { play } = useSound('notification/info', { volume: 0.3 })
  const dispatch = useDispatch()

  useEffect(() => {
    if (!isConnected) return

    function onGotNewMessage() {
      toast("You got a new message")
      play()
      dispatch(messagesApi.util.invalidateTags(['Conversations']))
    }

    socket.on('gotNewMessage', onGotNewMessage)

    return () => {
      socket.off('gotNewMessage', onGotNewMessage)
    }
  }, [dispatch, isConnected, play])
}
