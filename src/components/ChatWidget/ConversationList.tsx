import { useGetConversationsQuery } from '@/api/messagesApi'
import { Spinner } from '@/components/ui/spinner'

type Props = {
    onSelect: (conversationId: number) => void
}

const ConversationList = ({ onSelect }: Props) => {
    const { data: conversations, isLoading } = useGetConversationsQuery()

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
                    conversations?.map((conv, index) => (
                        <button
                            key={index}
                            onClick={() => onSelect(conv.conversationId)}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 border-b text-left"
                        >
                            <div
                                className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium shrink-0 overflow-hidden">
                                {conv.interlocutorAvatar ? (
                                    <img src={conv.interlocutorAvatar} alt=""
                                         className="w-full h-full object-cover rounded-full"/>
                                ) : (
                                    <span>{conv.interlocutorName?.[0] ?? conv.interlocutorEmail?.[0] ?? '?'}</span>
                                )}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-medium">
                                    {conv.interlocutorName ?? conv.interlocutorEmail ?? `User #${conv.interlocutorId}`}
                                </span>
                            </div>
                        </button>
                    ))
                )}
            </div>
        </div>
    )
}

export default ConversationList