import {Check, Pencil} from "lucide-react";
import {useState} from "react";

type TaskItemProps = {
    id: number
    title: string
    completed: boolean
    onToggle: (id: number, completed: boolean) => void
    onDelete: (id: number) => void
    onEdit: (id: number, title: string) => Promise<void>
}

const TaskItem = ({id, title, completed, onToggle, onDelete, onEdit}: TaskItemProps) => {
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [editTitle, setEditTitle] = useState(title)

    return (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
                {isEditing ? (
                    <>
                        <button onClick={async () => {
                            await onEdit(id, editTitle)
                            setIsEditing(false)
                        }}>
                            <Check size={16}/>
                        </button>
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="flex-1 border rounded-lg px-4 py-1 max-w-[85%]"
                        />
                    </>
                ) : (
                    <>
                        <button onClick={() => {
                            setIsEditing(true)
                            setEditTitle(title)
                        }}>
                            <Pencil size={16}/>
                        </button>
                        <input
                            type="checkbox"
                            checked={completed}
                            onChange={() => onToggle(id, !completed)}
                            className="w-5 h-5 cursor-pointer"
                        />
                        <span className={completed ? 'line-through text-gray-400 mr-1' : 'font-medium mr-1'}>{title}</span>
                    </>
                )
                }
            </div>
            <button onClick={() => onDelete(id)} className="text-red-400 hover:text-red-600 text-sm">
                Delete
            </button>
        </div>
    )
}

export default TaskItem