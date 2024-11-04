import { useEffect, useRef } from "react";
import useApiRequest from "../hooks/useAPI"
import { Navigate, useNavigate } from "react-router-dom";


export function Register({setRegistered}){

    const { sendRequest, data, error, loading } = useApiRequest({ auth: false });
    const emailRef = useRef("")

    const registerClick = () => {
        const email_data = {"email":emailRef.current.value}
        try {
            sendRequest("POST", "/auth/registration/", email_data)
        } catch (error) {
            console.log(error)
        }
  
    }

   useEffect(() => {
    if (data && !error) {
        setRegistered(true);
    }
   }, [data, error]);

    return (
        <>
        <div className="flex flex-col align-center bg-gray-50 items-center">
        <div className="m-5 relative inline-block text-center">
        <span className="inline-block text-3xl m-5">REGISTRATION</span>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-36 border-b-4  border-yellow-500"></div>
        </div>
  
        <div>{error && error.email && <p className="text-red-400 text-xs">Error: {error.email.join(', ')}</p>}
        <input className={`p-3 ${error && error.email ? 'border-red-400 border': ''}`} type="text" ref={emailRef} placeholder="Email Address" /></div>
        <button onClick={registerClick} className="header-buttons m-10 text-white">{loading ? "Sending..." : "Register"}</button>
        </div>
        </>
    )
}


export function RegisterConfirm(){
    const nav = useNavigate()

    const continueClick = () => {
        nav('/verify')
    }

    return (
        <>
        <div className="flex flex-col align-center bg-gray-50 items-center">
        <div className="m-5 relative inline-block text-center">
        <span className="inline-block text-3xl m-5">REGISTRATION</span>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-36 border-b-4  border-yellow-500"></div>
        </div>
  
        <p className="h">Thanks for Registration. You should check your eamil for the code, then press continue to finish registering.</p>
        <button onClick={continueClick} className="header-buttons m-10 text-white">Continue</button>
        </div>
        </> 
    )
}
