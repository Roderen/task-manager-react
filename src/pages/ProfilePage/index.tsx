import {ArrowLeft, UserRoundPen} from "lucide-react";
import {useGetUserQuery, useUpdateUserMutation} from "@/api/usersApi.ts";
import {useNavigate} from "react-router-dom";
import {useGetTasksCountQuery} from "@/api/tasksApi.ts";
import {Spinner} from "@/components/ui/spinner.tsx";
import React, {useEffect, useState} from "react";

const ProfilePage = () => {
    const { data: user, isLoading } = useGetUserQuery()
    const {data: count} = useGetTasksCountQuery();
    const [updateUser] = useUpdateUserMutation({})
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState({ name: '', avatar: '' })

    const handleSaveProfile = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        const result = await updateUser(profileData);
        console.log(result);
    }

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name ?? '',
                avatar: user.avatar ?? ''
            })
        }
    }, [user])

    if (isLoading) return <Spinner/>

    return (
        <div className="py-[40px] px-[15px]">
            <div className="max-w-2xl mx-auto">
                <ArrowLeft size={60} color="#000000" strokeWidth={2} className="cursor-pointer" onClick={() => navigate('/tasks')} />

                <div className="flex flex-col items-center justify-center">
                    {
                        user?.avatar !== null ? (
                            <div className="mb-[30px] rounded-full bg-black max-w-[160px] w-[100%] h-[100%]">
                                <img src={user?.avatar} alt="" className="w-[100%] h-[100%] rounded-full object-cover"/>
                            </div>
                        ) : (
                            <div className="mb-[30px] p-[30px] rounded-full bg-black max-w-[160px] w-[100%] h-[100%]">
                                <UserRoundPen size={100} color="#ffffff"/>
                            </div>
                        )
                    }
                    <div className="rounded-[10px] border-2 border-black p-[20px] w-full flex flex-col gap-[10px]">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <p className="w-[100px] shrink-0 font-bold">Name:</p>
                            <input
                                type="text"
                                value={profileData.name}
                                onChange={(e) => setProfileData(prev => ({...prev, name: e.target.value}))}
                                className="flex-1 max-w-[250px] border rounded-[5px] px-2 py-1"
                                id={user?.name}
                                name={user?.name}
                            />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <p className="w-[100px] shrink-0 font-bold">Avatar URL:</p>
                            <input
                                type="text"
                                value={profileData.avatar}
                                onChange={(e) => setProfileData(prev => ({...prev, avatar: e.target.value}))}
                                className="flex-1 max-w-[250px] border rounded-[5px] px-2 py-1"
                                id={user?.avatar}
                                name={user?.avatar}
                            />
                        </div>
                        <button
                            className="text-sm mt-2 bg-black text-white px-4 py-2 rounded-lg w-full max-w-[120px] cursor-pointer"
                            onClick={handleSaveProfile}
                        >
                            Save
                        </button>

                        <br/>

                        <div>
                            <p className="text-sm text-gray-500"><strong>Email:</strong> {user?.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500"><strong>Total tasks:</strong> {count?.total}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500"><strong>Completed tasks:</strong> {count?.completed}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500"><strong>Uncompleted
                                tasks:</strong> {count?.uncompleted}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage;