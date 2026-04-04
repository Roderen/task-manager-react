import {Input} from "@/components/ui/input.tsx";
import {Field} from "@/components/ui/field.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Link, useNavigate} from "react-router-dom";
import bgImage from "@/assets/LoginPage/bg.png"
import React, {useState} from "react";
import {useLoginMutation} from "@/api/authApi.ts";
import {useDispatch} from "react-redux";
import {login} from "@/store/authSlice.ts";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginUser, {isLoading}] = useLoginMutation({})
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        const result = await loginUser({email, password});

        if ('data' in result) {
            dispatch(login());
            navigate("/tasks");
        }
    }

    return (
        <div className="min-h-screen md:pt-20 md:pb-20 pt-10 pb-10 flex flex-col items-center justify-center">
            <div className="container h-[100%] mx-auto flex flex-col items-center justify-center">
                <div className="flex md:flex-row flex-col-reverse items-center gap-[30px] md:gap-[40px] flex-col w-[100%]">
                    <div className="w-[90%] md:w-1/2 flex flex-col items-center">
                        <div className="text-2xl font-bold mb-[20px] md:mb-[50px]">Login</div>

                        <div className="max-w-[430px] w-[100%]">
                            <form className="flex flex-col items-stretch gap-[15px]" onSubmit={handleSubmit}>
                                <Field>
                                    <Input name="email" type="email" value={email}
                                           onChange={(e) => setEmail(e.target.value)} placeholder="Email"
                                           className="px-[20px] py-[25px]" required/>
                                </Field>
                                <Field>
                                    <Input name="password" type="password" value={password}
                                           onChange={(e) => setPassword(e.target.value)} placeholder="Password"
                                           className="px-[20px] py-[25px]" required/>
                                </Field>

                                <Button type="submit" disabled={isLoading} className="py-[25px] text-xl">Login</Button>
                            </form>

                            <div className="mt-[60px] text-lg text-center">
                                Don't have an account? <Link to="/register" className="text-[#099962]">Register</Link>
                            </div>
                        </div>
                    </div>

                    <div className="w-[90%] md:w-1/2 flex flex-col items-center">
                        <div className="text-4xl font-bold mb-[20px] md:mb-[40px]">Stay on <span
                            className="text-[#099962]">Track</span>
                        </div>
                        <p className="max-w-[450px] text-[#757575] text-[18px] md:text-[20px] text-center mb-[15px] md:mb-[25px]">
                            Welcome back! Pick up right where you left off and stay on top of what matters most.
                        </p>
                        <div className="max-w-[560px] w-[100%] h-auto hidden md:block">
                            <img src={bgImage} alt="goals"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage