import { useState } from "react"
import { X } from "lucide-react"

type CreateTaskPopupProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (title: string, description?: string) => Promise<void>
}

const CreateTaskPopup = ({ isOpen, onClose, onSubmit }: CreateTaskPopupProps) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    await onSubmit(title, description || undefined)
    setTitle('')
    setDescription('')
    onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-8 w-full w-[100%] max-w-[900px] mx-4 flex flex-col gap-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl">Create Task</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 uppercase tracking-wide">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Task title..."
              className="border rounded-lg px-3 py-2 text-sm w-full"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 uppercase tracking-wide">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add description..."
              className="border rounded-lg px-3 py-2 text-sm w-full resize-none h-32"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-500 hover:text-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded-lg text-sm"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateTaskPopup
