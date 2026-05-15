import {Check, Pencil} from "lucide-react";
import {useState} from "react";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog.tsx";

type TaskItemProps = {
    id: number,
    userId: number,
    currentUserId?: number,
    needsHelp?: boolean,
    title: string,
    completed: boolean,
    onToggle: (id: number, completed: boolean) => void,
    onDelete: (id: number) => void,
    onEdit: (id: number, title?: string, needsHelp?: boolean) => Promise<void>,
    createdAt: Date
}

const TaskItem = ({
                      id,
                      userId,
                      currentUserId,
                      title,
                      needsHelp,
                      completed,
                      onToggle,
                      onDelete,
                      onEdit,
                      createdAt
                  }: TaskItemProps) => {
    const isOwner = currentUserId === userId
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
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            {isOwner && <>
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
                            </>
                            }
                            <span
                                className={completed ? 'line-through text-gray-400 mr-1' : 'font-medium mr-1'}>{title}</span>
                        </div>
                        <div className="mt-2">
                            <p className="text-[14px]">{new Date(createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                )
                }
            </div>
            {isOwner && (
                <div className="flex items-center gap-6">
                    {!completed ? (
                        <button className="cursor-pointer underline" onClick={async () => {
                            await onEdit(id, undefined, !needsHelp)
                        }}>
                            {needsHelp ? 'Cancel Help' : 'Ask Help'}
                        </button>
                    ) : ''}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <button className="text-red-400 hover:text-red-600 text-sm">Delete</button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onDelete(id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            )}
            {!isOwner && <p>Text Me Button</p>}
        </div>
    )
}

export default TaskItem