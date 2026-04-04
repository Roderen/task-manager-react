import './App.css'
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import LoginPage from './pages/LoginPage';
import RegisterPage from "@/pages/RegisterPage";
import TasksPage from "@/pages/TasksPage";
import {ProtectedRoute} from "../ProtectedRoute.tsx";
import {useCheckTokenQuery} from '@/api/authApi'
import {useDispatch, useSelector} from 'react-redux'
import {login} from '@/store/authSlice'
import {useEffect} from "react";
import type {RootState} from "@/store/store.ts";
import {Spinner} from "@/components/ui/spinner.tsx";

function App() {
    const getToken = useSelector((state: RootState) => state.auth.isAuthenticated)
    const dispatch = useDispatch()
    const {isSuccess, isLoading} = useCheckTokenQuery()

    useEffect(() => {
        if (isSuccess) {
            dispatch(login())
        }
    }, [isSuccess])

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center">
            <Spinner className="size-10"/>
        </div>
    )

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={
                        getToken ? <Navigate to="/tasks" replace/> : <LoginPage/>
                    }/>
                    <Route path="/register" element={
                        getToken ? <Navigate to="/tasks" replace/> : <RegisterPage/>
                    }/>

                    <Route element={<ProtectedRoute isAuthenticated={getToken}/>}>
                        <Route path="/tasks" element={<TasksPage/>}/>
                    </Route>

                    <Route path="*" element={<Navigate to="/login" replace/>}/>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
