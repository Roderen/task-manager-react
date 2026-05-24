import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Send } from 'lucide-react'
import {useDeleteMessageMutation, useGetMessagesQuery, useSendMessageMutation} from '@/api/messagesApi'
import { Spinner } from '@/components/ui/spinner'
import { socket } from '@/hooks/useSocket'
import {useGetUserQuery} from "@/api/usersApi.ts";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type Props = {
    conversationId: number
    onBack: () => void
}

const ChatWindow = ({ conversationId, onBack }: Props) => {
    const [text, setText] = useState('')
    const [realtimeMessages, setRealtimeMessages] = useState<any[]>([])
    const { data: currentUser } = useGetUserQuery()
    const { data: getMessages, isLoading } = useGetMessagesQuery(conversationId)
    const [sendMessage] = useSendMessageMutation()
    const bottomRef = useRef<HTMLDivElement>(null)
    const [isTyping, setIsTyping] = useState(false)
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const [deleteMessage] = useDeleteMessageMutation()

    const handleDeleteMessage = (messageId: number) => {
        deleteMessage({messageId: messageId})
    }

    useEffect(() => {
        socket.emit('joinChat', { conversationId })

        function onNewMessage(message: any) {
            setRealtimeMessages(prev => [...prev, message])
        }

        function onUserTyping() {
            setIsTyping(true)
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
            typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000)
        }

        socket.on('newMessage', onNewMessage)
        socket.on('userTyping', onUserTyping)
        return () => {
            socket.off('newMessage', onNewMessage)
            socket.off('userTyping', onUserTyping)
        }
    }, [conversationId])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [getMessages, realtimeMessages])

    const allMessages = [...(getMessages?.messages ?? []), ...realtimeMessages]

    const handleSend = async () => {
        if (!text.trim()) return
        await sendMessage({ conversationId, text })
        setText('')
    }

    return (
        <div className="flex flex-col h-full">
            <div className="px-4 py-3 border-b bg-black text-white flex items-center gap-2">
                <button onClick={onBack}>
                    <ArrowLeft size={16}/>
                </button>
                <span className="font-medium text-sm">Chat #{conversationId}</span>
            </div>

            <div className="flex-1 overflow-y-auto pt-4 pb-6 px-6 flex flex-col gap-2">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Spinner className="size-6"/>
                    </div>
                ) : (
                    <div className="relative flex flex-col gap-2">
                        {allMessages.map((msg, i) => (
                            msg.deletedAt === null ? (
                                <div
                                    key={msg.id ?? i}
                                    className={`group relative max-w-[75%] px-3 py-2 rounded-2xl text-sm flex items-center gap-1 ${
                                        msg.senderId === currentUser?.id
                                            ? 'bg-black text-white self-start rounded-bl-sm'
                                            : 'bg-gray-100 text-black self-end rounded-br-sm'
                                    }`}
                                >
                                    <span>{msg.text}</span>

                                    {msg.senderId === currentUser?.id && (
                                        <DropdownMenu modal={false}>
                                            <DropdownMenuTrigger className="group-opacity-100 ml-1">
                                                ⋮
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDeleteMessage(msg.id)}
                                                                  className="text-red-500">Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </div>
                            ) : (
                                <div
                                    key={msg.id ?? i}
                                    className={`group relative max-w-[75%] px-3 py-2 rounded-2xl text-sm flex items-center gap-1 ${
                                        msg.senderId === currentUser?.id
                                            ? 'bg-black text-gray-500 self-start rounded-bl-sm'
                                            : 'bg-gray-100 text-gray-400 self-end rounded-br-sm'
                                    }`}
                                >
                                    <span>Message deleted</span>
                                </div>
                            )
                        ))}
                        <div ref={bottomRef}/>
                        {isTyping && <div
                            className="absolute bottom-[-20px] self-end text-sm text-gray-400 px-1">typing...</div>}
                    </div>
                )}
            </div>

            <div className="p-3 border-t flex flex-col gap-1">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => {
                            setText(e.target.value)
                            socket.emit('typing', {conversationId})
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type a message..."
                        className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <button
                        onClick={handleSend}
                        className="bg-black text-white p-2 rounded-lg"
                    >
                        <Send size={16}/>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChatWindow