import { MessageCircle, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ConversationList from './ConversationList'
import ChatWindow from './ChatWindow'
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store/store.ts";
import {toggleChat, setActiveConversation} from "@/store/chatSlice.ts";

const ChatWidget = () => {
    const isOpen = useSelector((state: RootState) => state.chat.isOpen)
    const dispatch = useDispatch()
    const activeConversationId = useSelector((state: RootState) => state.chat.activeConversationId);

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="w-[340px] h-[480px] bg-white rounded-2xl shadow-xl border flex flex-col overflow-hidden"
                    >
                        {activeConversationId ? (
                            <ChatWindow
                                conversationId={activeConversationId}
                                onBack={() => dispatch(setActiveConversation(null))}
                            />
                        ) : (
                            <ConversationList onSelect={(id) => dispatch(setActiveConversation(id))} />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => dispatch(toggleChat())}
                className="bg-black text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors"
            >
                {isOpen ? <X size={20} /> : <MessageCircle size={20} />}
            </button>
        </div>
    )
}

export default ChatWidget