import { MessageCircleMore, HandHelping, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog.tsx";
import { setActiveConversation, toggleChat } from "@/store/chatSlice.ts";
import { useDispatch } from "react-redux";
import { useCreateConversationMutation } from "@/api/messagesApi.ts";
import TaskPopup from "./TaskPopup";

type TaskItemProps = {
  id: number
  userId: number
  currentUserId?: number
  needsHelp?: boolean
  title: string
  completed: boolean
  description?: string
  userEmail: string
  onToggle: (id: number, completed: boolean) => void
  onDelete: (id: number) => void
  onEdit: (id: number, title?: string, needsHelp?: boolean, description?: string) => Promise<void>
  createdAt: Date
}

const TaskItem = ({
  id, userId, currentUserId, title, needsHelp,
  completed, description, userEmail, onToggle, onDelete, onEdit, createdAt
}: TaskItemProps) => {
  const isOwner = currentUserId === userId
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const dispatch = useDispatch()
  const [createConversation] = useCreateConversationMutation()

  return (
    <>
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div
          className="flex flex-col cursor-pointer flex-1"
          onClick={() => setIsPopupOpen(true)}
        >
          <span className={completed ? 'text-xs min-[430px]:text-base line-through text-gray-400' : 'text-xs min-[430px]:text-base font-medium'}>
            {title}
          </span>
          <p className="text-[14px] mt-2">{new Date(createdAt).toLocaleDateString()}</p>
        </div>

        <div className="flex items-center gap-4">
          {isOwner && (
            <>
              {!completed && (
                <button className="cursor-pointer underline" onClick={() => onEdit(id, undefined, !needsHelp)}>
                  {needsHelp ? (
                    <div className="flex items-center gap-1">
                      <HandHelping size={24} />
                      <span className="text-sm">(Cancel)</span>
                    </div>
                  ) : <HandHelping size={24} />}
                </button>
              )}

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="text-red-400 hover:text-red-600"><Trash2 size={20} /></button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(id)}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}

          {!isOwner && (
            <button className="cursor-pointer" onClick={async () => {
              const result = await createConversation({ receiverId: userId })
              if ('data' in result && result.data) {
                dispatch(toggleChat())
                dispatch(setActiveConversation(result.data.conversationId))
              }
            }}>
              <MessageCircleMore size={24} />
            </button>
          )}
        </div>
      </div>

      <TaskPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        id={id}
        title={title}
        description={description}
        completed={completed}
        needsHelp={needsHelp}
        userEmail={userEmail}
        createdAt={createdAt}
        isOwner={isOwner}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    </>
  )
}

export default TaskItem
