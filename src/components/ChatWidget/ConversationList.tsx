import { useGetConversationsQuery } from '@/api/messagesApi'
import { Spinner } from '@/components/ui/spinner'
import type { RootState } from '@/store/store'
import { useSelector } from 'react-redux'

type Props = {
  onSelect: (conversationId: number) => void
}

const ConversationList = ({ onSelect }: Props) => {
  const { data: conversations, isLoading } = useGetConversationsQuery()
  const onlineUsers = useSelector((state: RootState) => state.online.onlineUsers)

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b bg-black text-white">
        <span className="font-medium text-sm">Chats</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner className="size-6" />
          </div>
        ) : conversations?.length === 0 ? (
          <p className="text-gray-400 text-sm text-center mt-8">No chats yet</p>
        ) : (
          conversations?.map((conv, index) => {
            const isOnline = onlineUsers.includes(conv.interlocutorId)

            return (
              <button
                key={index}
                onClick={() => onSelect(conv.conversationId)}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 border-b text-left"
              >
                <div className="flex justify-between items-center gap-4 w-100">
                  <div className="flex items-center gap-2">
                    <div
                      className="relative w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium shrink-0">
                      {conv.interlocutorAvatar ? (
                        <img src={conv.interlocutorAvatar} alt=""
                          className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <span>{conv.interlocutorName?.[0] ?? conv.interlocutorEmail?.[0] ?? '?'}</span>
                      )}
                      {isOnline && (
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium">
                        {conv.interlocutorName ?? conv.interlocutorEmail ?? `User #${conv.interlocutorId}`}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-sm text-red-500">
                    {conv.unreadCount > 0 ? (conv.unreadCount > 99 ? '99+' : conv.unreadCount) : ''}
                  </div>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}

export default ConversationList
