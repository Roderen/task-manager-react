import {ArrowLeft, UserRoundPen} from "lucide-react";
import {useGetUserQuery, useUpdateUserMutation} from "@/api/usersApi.ts";
import {useNavigate} from "react-router-dom";
import {useGetTasksCountQuery} from "@/api/tasksApi.ts";
import {Spinner} from "@/components/ui/spinner.tsx";
import React, {useEffect, useState} from "react";
import {useChangePasswordConfirmMutation, useChangePasswordRequestMutation} from "@/api/authApi.ts";
import {toast} from "sonner";

const ProfilePage = () => {
    const { data: user, isLoading } = useGetUserQuery()
    const {data: count} = useGetTasksCountQuery();
    const [updateUser] = useUpdateUserMutation({})
    const [changePasswordRequest] = useChangePasswordRequestMutation()
    const [changePasswordConfirm] = useChangePasswordConfirmMutation()
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState({ name: '', avatar: '' })
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [passwordData, setPasswordData] = useState({ newPassword: '', confirmPassword: '' })
    const [passwordStep, setPasswordStep] = useState<'form' | 'code'>('form')
    const [confirmCode, setConfirmCode] = useState('')

    const handleSaveProfile = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        const result = await updateUser(profileData);

        if ('data' in result) {
            toast.success('Changes has been saved.')
        } else {
            toast.error((result.error as any).data?.message ?? 'Something went wrong')
        }
    }

    const handleChangePassword = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Passwords do not match')
            return;
        }

        const result = await changePasswordRequest({ newPassword: passwordData.newPassword })
        if ('data' in result) {
            setPasswordStep('code')
        } else {
            toast.error((result.error as any).data?.message ?? 'Something went wrong')
        }
    }

    const handleConfirmPassword = async (e: React.SyntheticEvent) => {
        e.preventDefault()

        const result = await changePasswordConfirm({ code: confirmCode })
        if ('data' in result) {
            setShowPasswordModal(false)
            setPasswordStep('form')
            setPasswordData({ newPassword: '', confirmPassword: '' })
            setConfirmCode('')
            toast.success('Password has been changed.')
        } else {
            toast.error((result.error as any).data?.message ?? 'Something went wrong')
        }
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
        <div className="min-h-screen bg-gray-50 py-[40px] px-[15px]">
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4">
                        <h2 className="text-xl font-bold mb-6">Change Password</h2>

                        {passwordStep === 'form' ? (
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700">New Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData(prev => ({...prev, newPassword: e.target.value}))}
                                        className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                        placeholder="Enter new password"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData(prev => ({...prev, confirmPassword: e.target.value}))}
                                        className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                        placeholder="Confirm new password"
                                    />
                                </div>
                                <div className="flex gap-3 mt-2">
                                    <button
                                        onClick={() => setShowPasswordModal(false)}
                                        className="flex-1 border-2 border-black py-2 rounded-lg text-sm font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleChangePassword}
                                        className="flex-1 bg-black text-white py-2 rounded-lg text-sm font-medium"
                                    >
                                        Send code
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <p className="text-sm text-gray-500">Enter the code sent to your email</p>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700">Confirmation code</label>
                                    <input
                                        type="text"
                                        value={confirmCode}
                                        onChange={(e) => setConfirmCode(e.target.value)}
                                        className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                        placeholder="Enter 6-digit code"
                                    />
                                </div>
                                <div className="flex gap-3 mt-2">
                                    <button
                                        onClick={() => setPasswordStep('form')}
                                        className="flex-1 border-2 border-black py-2 rounded-lg text-sm font-medium"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handleConfirmPassword}
                                        className="flex-1 bg-black text-white py-2 rounded-lg text-sm font-medium"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}


            <div className="max-w-2xl mx-auto">
                <ArrowLeft size={32} className="cursor-pointer mb-6" onClick={() => navigate('/tasks')} />

                <div className="bg-white rounded-2xl shadow-sm border p-8 flex flex-col items-center gap-6">

                    {/* Avatar */}
                    <div className="relative">
                        {user?.avatar ? (
                            <img src={user.avatar} alt="" className="w-[120px] h-[120px] rounded-full object-cover border-4 border-black"/>
                        ) : (
                            <div className="w-[120px] h-[120px] rounded-full bg-black flex items-center justify-center">
                                <UserRoundPen size={60} color="#ffffff"/>
                            </div>
                        )}
                    </div>

                    {/* Email */}
                    <p className="text-gray-500 text-sm">{user?.email}</p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 w-full text-center">
                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-2xl font-bold">{count?.total ?? 0}</p>
                            <p className="text-xs text-gray-500 mt-1">Total</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-2xl font-bold text-green-600">{count?.completed ?? 0}</p>
                            <p className="text-xs text-gray-500 mt-1">Completed</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-2xl font-bold text-orange-500">{count?.uncompleted ?? 0}</p>
                            <p className="text-xs text-gray-500 mt-1">Uncompleted</p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="w-full flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                value={profileData.name}
                                onChange={(e) => setProfileData(prev => ({...prev, name: e.target.value}))}
                                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">Avatar URL</label>
                            <input
                                type="text"
                                value={profileData.avatar}
                                onChange={(e) => setProfileData(prev => ({...prev, avatar: e.target.value}))}
                                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>
                        <button
                            onClick={handleSaveProfile}
                            className="cursor-pointer bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                        >
                            Save changes
                        </button>
                        <button
                            onClick={() => setShowPasswordModal(true)}
                            className="cursor-pointer border-2 border-black text-black py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                            Change password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage;