import React, { useEffect, useRef, useState } from "react";
import useApiRequest from "../hooks/useAPI"
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginUser } from "../store/slices/userSlice";


export default function LoginForm({setForgotPW}){
    const { sendRequest, data, error, loading } = useApiRequest({ auth: true });
    const [requestError, setRequestError] = useState("")
    const [token, setToken] = useState("")
    const d = useDispatch()
    //  const base_url =  // "https://luna-rizl.propulsion-learn.ch/backend/api/"

    const emailRef = useRef("");
    const passwordRef = useRef("");
    const nav = useNavigate()

    const forgotPWClick = () => {
        setForgotPW(true)
    }

    const loginClick = async (e) => {
        e.preventDefault()
        const login_data = {
            "email": emailRef.current.value,
            "password": passwordRef.current.value,
        }
        console.log("data", login_data)
        try {
            const resp = await axios.post("auth/token/", login_data)
            const t = resp.data.access
            setToken(t)
            localStorage.setItem('token', t)
     
            console.log('resp', resp)
        } catch (error) {
            setRequestError(error)
            console.log(error)
        }
    }

    useEffect(() => {
        if (token) {
            sendRequest('GET', '/user/me/', {}, false)
        }
    }, [token])

    useEffect(() => {
        if (data && !error) {
            const login_data = {user: data, accessToken: token}
            d(loginUser(login_data))
            nav('/')
        }
    }, [data, error])

   return (
    <>
    <div className="flex flex-col w-full max-w-md p-6 bg-white rounded-lg shadow-md space-y-6">
        <div className="mt-2 pt-2 relative inline-block text-center">
            {/*<span className="inline-block text-2xl">LOGIN</span>*/}
            <div className="mx-auto inline-block"><img src="/logo.png" alt="Pocketmind"/></div>
        </div>

        <form onSubmit={loginClick} className="space-y-6">
            <div className="m-2 relative">{error && error.email && <p className="text-red-400 text-xs">Error: {error.email.join(', ')}</p>}
    <input className={`input input-bordered w-full mt-2 py-2 px-4 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 ${error && error.email ? 'border-red-400 border': ''}`} type="text" ref={emailRef} placeholder="Email Address" /></div>

    {/* <div>{error && error.email && <p className="text-red-400 text-xs">Error: {error.email.join(', ')}</p>} */}
    {/* <input className={`p-3 ${error && error.email ? 'border-red-400 border': ''}`} type="text" ref={emailRef} placeholder="Email Address" /></div> */}

    <div className="m-2 relative">{error && error.password && <p className="text-red-400 text-xs">Error: {error.password.join(', ')}</p>}
    <input className={`input input-bordered w-full mt-2 py-2 px-4 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 ${error && error.password ? 'border-red-400 border': ''}`} type="password" ref={passwordRef} placeholder="Password" />
    
    <div className="text-right mt-2">
    <a onClick={forgotPWClick} className="text-gray-400 text-xs cursor-pointer hover:underline">
      Forgot password?
    </a></div>
    </div>

    {error && <p className="text-red-400">Error: {error.detail}</p> }
    {requestError && <p className="text-red-400">Please check your login credentials.</p> }
    <div className="text-center">
    <button type="submit" onClick={loginClick} className="w-11/12 px-6 text-2xl py-2 font-semibold text-white bg-custom2 rounded-md shadow-lg">{loading ? "Loading..." : "Login"}</button></div>
    </form>
    </div>
    </>
   )
}
