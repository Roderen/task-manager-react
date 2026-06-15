import { useState } from "react"
import { HandHelping, Pencil, Trash2, X } from "lucide-react"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog.tsx"

type TaskPopupProps = {
  isOpen: boolean
  onClose: () => void
  id: number
  title: string
  description?: string
  completed: boolean
  needsHelp?: boolean
  userEmail: string
  createdAt: Date
  isOwner: boolean
  onToggle: (id: number, completed: boolean) => void
  onDelete: (id: number) => void
  onEdit: (id: number, title?: string, needsHelp?: boolean, description?: string) => Promise<void>
}

const TaskPopup = ({
  isOpen, onClose, id, title, description, completed,
  needsHelp, userEmail, createdAt, isOwner, onToggle, onDelete, onEdit
}: TaskPopupProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(title)
  const [editDescription, setEditDescription] = useState(description ?? '')

  if (!isOpen) return null

  const handleSave = async () => {
    await onEdit(id, editTitle, needsHelp, editDescription)
    setIsEditing(false)
    onClose()
  }

  const handleCancel = () => {
    setEditTitle(title)
    setEditDescription(description ?? '')
    setIsEditing(false)
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-8 w-full min-w-[900px] max-w-[900px] mx-4 flex flex-col gap-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl">{userEmail}</h2>
          <div className="flex items-center gap-3">
            {isOwner && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-black transition-colors"
              >
                <Pencil size={16} />
                Edit
              </button>
            )}
            <button onClick={onClose}><X size={20} /></button>
          </div>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400 uppercase tracking-wide">Title</label>
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm font-medium w-full"
            />
          ) : (
            <p className={`font-medium text-base ${completed ? 'line-through text-gray-400' : ''}`}>
              {title}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400 uppercase tracking-wide">Description</label>
          {isEditing ? (
            <textarea
              value={editDescription}
              onChange={e => setEditDescription(e.target.value)}
              placeholder="Add description..."
              className="border rounded-lg px-3 py-2 text-sm w-full resize-none h-32"
            />
          ) : (
            <p className="text-sm text-gray-600">{description || 'No description'}</p>
          )}
        </div>

        {/* Meta */}
        <div className="flex gap-6 text-sm text-gray-400">
          <span>Created by: <span className="text-gray-600">{userEmail}</span></span>
          <span>Created at: <span className="text-gray-600">{new Date(createdAt).toLocaleDateString()}</span></span>
        </div>

        {/* Completed */}
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={completed}
            onChange={() => isOwner && onToggle(id, completed)}
            disabled={!isOwner}
            className="w-4 h-4"
          />
          Completed
        </label>

        {/* Footer */}
        {isOwner && (
          <div className="flex justify-between items-center pt-2 border-t">
            <div className="flex items-center gap-4">
              {!completed && (
                <button
                  onClick={() => onEdit(id, undefined, !needsHelp)}
                  className="flex items-center gap-1 text-sm underline"
                >
                  <HandHelping size={18} />
                  {needsHelp ? 'Cancel help request' : 'Ask for help'}
                </button>
              )}

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="text-red-400 hover:text-red-600 flex items-center gap-1 text-sm">
                    <Trash2 size={18} />
                    Delete
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => { onDelete(id); onClose() }}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            {isEditing && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm text-gray-500 hover:text-black"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-black text-white px-4 py-2 rounded-lg text-sm"
                >
                  Save
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskPopup
