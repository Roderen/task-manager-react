import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Send } from 'lucide-react'
import { messagesApi, useDeleteMessageMutation, useEditMessageMutation, useGetMessagesInfiniteQuery, useMarkAsReadMutation, useSendMessageMutation } from '@/api/messagesApi'
import { Spinner } from '@/components/ui/spinner'
import { socket } from '@/hooks/useSocket'
import { useGetUserQuery } from "@/api/usersApi.ts"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Message } from '@/types/messages'
import { useAppDispatch } from '@/store/store'

type Props = {
  conversationId: number
  onBack: () => void
}

const ChatWindow = ({ conversationId, onBack }: Props) => {
  const [text, setText] = useState('')
  const [realtimeMessages, setRealtimeMessages] = useState<Message[]>([])
  const { data: currentUser } = useGetUserQuery()
  const { data, isLoading, isFetching, hasNextPage, fetchNextPage } =
    useGetMessagesInfiniteQuery(conversationId)
  const [sendMessage] = useSendMessageMutation()
  const [markAsRead] = useMarkAsReadMutation()
  const bottomRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const [isTyping, setIsTyping] = useState(false)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [editingMessage, setEditingMessage] = useState<{ id: number, text: string } | null>(null)
  const [editMessage] = useEditMessageMutation()
  const [deleteMessage] = useDeleteMessageMutation()
  const dispatch = useAppDispatch()

  const handleEdit = async () => {
    if (!editingMessage) return
    setRealtimeMessages(prev =>
      prev.map(msg => msg.id === editingMessage.id
        ? { ...msg, text: editingMessage.text, editedAt: new Date().toISOString() }
        : msg
      )
    )
    await editMessage({ messageId: editingMessage.id, text: editingMessage.text })
    setEditingMessage(null)
  }

  const allMessages = [
    ...(data?.pages.slice().reverse().flatMap(page => page.messages) ?? []),
    ...realtimeMessages
  ]

  useEffect(() => {
    if (!isLoading) {
      bottomRef.current?.scrollIntoView()
      const pages = data?.pages
      const lastPage = pages?.[pages.length - 1]
      const lastMessage = lastPage?.messages?.[lastPage.messages.length - 1]
      if (lastMessage) {
        markAsRead({ conversationId, messageId: lastMessage.id })
      }
    }
  }, [conversationId, data?.pages, isLoading, markAsRead])

  const handleDeleteMessage = (messageId: number) => {
    deleteMessage({ messageId })
  }

  useEffect(() => {
    socket.emit('joinChat', { conversationId })

    function onNewMessage(message: Message) {
      setRealtimeMessages(prev => [...prev, message])
    }

    function onUserTyping() {
      setIsTyping(true)
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000)
    }

    function onStopTyping() {
      setIsTyping(false)
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    }

    function onMessageEdited(message: Message) {
      dispatch(
        messagesApi.util.updateQueryData('getMessages', conversationId, (draft) => {
          for (const page of draft.pages) {
            const index = page.messages.findIndex((msg: Message) => msg.id === message.id)
            if (index !== -1) {
              page.messages[index] = message
              break
            }
          }
        })
      )
      setRealtimeMessages(prev =>
        prev.map(msg => msg.id === message.id ? message : msg)
      )
    }

    socket.on('newMessage', onNewMessage)
    socket.on('userTyping', onUserTyping)
    socket.on('stopTyping', onStopTyping)
    socket.on('messageEdited', onMessageEdited)
    return () => {
      socket.off('newMessage', onNewMessage)
      socket.off('userTyping', onUserTyping)
      socket.off('stopTyping', onStopTyping)
      socket.off('messageEdited', onMessageEdited)
    }
  }, [conversationId, dispatch])

  // Скролл вниз при первой загрузке
  useEffect(() => {
    if (!isLoading) {
      bottomRef.current?.scrollIntoView()
    }
  }, [isLoading])

  // Observer для подгрузки старых сообщений
  useEffect(() => {
    if (isLoading) return
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetching) {
          const prevHeight = listRef.current?.scrollHeight ?? 0
          fetchNextPage().then(() => {
            requestAnimationFrame(() => {
              const newHeight = listRef.current?.scrollHeight ?? 0
              listRef.current?.scrollTo({ top: newHeight - prevHeight })
            })
          })
        }
      })
      if (topRef.current) observer.observe(topRef.current)
      return () => observer.disconnect()
    }, 300)
    return () => clearTimeout(timer)
  }, [hasNextPage, isFetching, isLoading, fetchNextPage])

  useEffect(() => {
    if (!isLoading) {
      bottomRef.current?.scrollIntoView()
      const pages = data?.pages
      const lastPage = pages?.[pages.length - 1]
      const lastMessage = lastPage?.messages?.[lastPage.messages.length - 1]
      if (lastMessage) {
        markAsRead({ conversationId, messageId: lastMessage.id })
      }
    }
  }, [conversationId, data?.pages, isLoading, markAsRead])

  const handleSend = async () => {
    if (!text.trim()) return
    await sendMessage({ conversationId, text })
    setText('')
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b bg-black text-white flex items-center gap-2">
        <button onClick={onBack}>
          <ArrowLeft size={16} />
        </button>
        <span className="font-medium text-sm">Chat #{conversationId}</span>
      </div>

      <div ref={listRef} className="flex-1 overflow-y-auto pt-4 pb-6 px-6 flex flex-col gap-2">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner className="size-6" />
          </div>
        ) : (
          <div className="relative flex flex-col gap-2">
            {hasNextPage && <div ref={topRef} />}
            {allMessages.map((msg, i) => (
              msg.deletedAt === null ? (
                <div
                  key={msg.id ?? i}
                  className={`group relative min-w-[17%] max-w-[75%] px-3 py-3 rounded-2xl text-sm flex items-center gap-1 ${msg.senderId === currentUser?.id
                    ? 'bg-black text-white self-start rounded-bl-sm'
                    : 'bg-gray-100 text-black self-end rounded-br-sm'
                    }`}
                >
                  <span className="break-all">{msg.text}</span>
                  {msg.editedAt !== null ? (
                    <div className='absolute text-[8px] bottom-[2px] right-[10px]'>Edited</div>
                  ) : ''}
                  {msg.senderId === currentUser?.id && (
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger className="group-opacity-100 ml-1">
                        ⋮
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setEditingMessage({ id: msg.id, text: msg.text })}>
                          Редактировать
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="text-red-500"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              ) : (
                <div
                  key={msg.id ?? i}
                  className={`group relative max-w-[75%] px-3 py-2 rounded-2xl text-sm flex items-center gap-1 ${msg.senderId === currentUser?.id
                    ? 'bg-black text-gray-500 self-start rounded-bl-sm'
                    : 'bg-gray-100 text-gray-400 self-end rounded-br-sm'
                    }`}
                >
                  <span>Message deleted</span>
                </div>
              )
            ))}
            <div ref={bottomRef} />
            {isTyping && (
              <div className="absolute bottom-[-20px] self-end text-sm text-gray-400 px-1">
                typing...
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-3 border-t flex flex-col gap-1">
        {editingMessage && (
          <div className="text-xs text-gray-400 px-1 flex justify-between">
            <span>Editing...</span>
            <button onClick={() => setEditingMessage(null)}>✕</button>
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={editingMessage ? editingMessage.text : text}
            onChange={(e) => editingMessage
              ? setEditingMessage({ ...editingMessage, text: e.target.value })
              : setText(e.target.value)
            }
            onKeyDown={(e) => e.key === 'Enter' && (editingMessage ? handleEdit() : handleSend())}
            placeholder="Type a message..."
            className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            onClick={editingMessage ? handleEdit : handleSend}
            className="bg-black text-white p-2 rounded-lg"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatWindow
