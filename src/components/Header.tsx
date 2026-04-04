import { Button } from '@/components/ui/button'
import {useLogoutMutation} from "@/api/authApi.ts";
import {useNavigate} from "react-router-dom";
import { logout as logoutAction } from '@/store/authSlice'
import {useDispatch} from "react-redux";

type HeaderProps = {
    onNewTask: () => void
}

const Header = ({ onNewTask }: HeaderProps) => {
    const [logout] = useLogoutMutation()
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const handleLogout = async () => {
        await logout()
        dispatch(logoutAction())
        navigate("/login")
    }

    return (
        <header className="flex items-center gap-2 md:justify-between px-4 md:px-8 py-4 border-b">
            <div className="text-xl font-bold">TaskManager</div>
            <Button onClick={onNewTask} className="cursor-pointer ml-auto md:ml-0">+ New Task</Button>
            <Button onClick={handleLogout} className="text-m text-white cursor-pointer">Logout</Button>
        </header>
    )
}

export default Header