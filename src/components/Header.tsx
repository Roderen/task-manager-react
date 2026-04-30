import { Button } from '@/components/ui/button'
import {useLogoutMutation} from "@/api/authApi.ts";
import {useNavigate} from "react-router-dom";
import { logout as logoutAction } from '@/store/authSlice'
import {useDispatch} from "react-redux";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger} from './ui/dropdown-menu';
import {LogOutIcon, UserIcon, UserRound} from "lucide-react";
import {useGetUserQuery, usersApi} from "@/api/usersApi.ts";
import {toast} from "sonner";

type HeaderProps = {
    onNewTask: () => void
}

const Header = ({ onNewTask }: HeaderProps) => {
    const [logout] = useLogoutMutation()
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const {data: user} = useGetUserQuery();

    const handleLogout = async () => {
        await logout()
        dispatch(logoutAction())
        dispatch(usersApi.util.resetApiState())
        navigate("/login")
        toast.info("You have logged out!");
    }

    return (
        <header className="flex items-center gap-2 md:justify-between px-4 md:px-8 py-4 border-b">
            <div className="text-xl font-bold">TaskManager</div>
            <Button onClick={onNewTask} className="cursor-pointer ml-auto md:ml-0">+ New Task</Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div
                        className="w-[48px] h-[48px] rounded-full cursor-pointer overflow-hidden flex items-center justify-center bg-gray-200">
                        {user?.avatar ? (
                            <img src={user.avatar} className="w-full h-full object-cover rounded-full" alt="avatar"/>
                        ) : (
                            <UserRound size={24} className="text-gray-500"/>
                        )}
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                        <UserIcon/>
                        Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onClick={handleLogout} variant="destructive">
                        <LogOutIcon />
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    )
}

export default Header