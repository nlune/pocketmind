import { useEffect, useRef, useState } from "react";
import useApiRequest from "../hooks/useAPI"
import { useNavigate } from "react-router-dom";

export default function VerificationPage(){
    const { sendRequest, data, error, loading } = useApiRequest({ auth: false });
    const [pwError, setPWError] = useState(false)
    const emailRef = useRef("")
    const validationCodeRef = useRef("");
    const usernameRef = useRef("");
    const locationRef = useRef("");
    const passwordRef = useRef("");
    const passwordRepeatRef = useRef("");
    const nav = useNavigate()

    const finishRegClick = () => {
        const reg_data = {
            "email": emailRef.current.value,
            "code": validationCodeRef.current.value,
            "username": usernameRef.current.value,
            "location": locationRef.current.value,
            "password": passwordRef.current.value,
            "password_repeat": passwordRepeatRef.current.value,
        }
        if (passwordRef.current.value !== passwordRepeatRef.current.value){
            setPWError("Passwords don't match")
            return;
        }

        try {
            sendRequest("POST", "/auth/registration/validation/", reg_data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (data && !error) {
            nav('/login')
        }
    }, [data, error])

   return (
    <>
    <div className="flex flex-col align-center bg-gray-50 items-center">
    <div className="m-5 relative inline-block text-center">
    <span className="inline-block text-3xl m-5">Verification</span>
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-36 border-b-4  border-yellow-500"></div>
    </div>

<div className="grid grid-cols-2 gap-6 m-2">
<div>{error && error.email && <p className="text-red-400 text-xs">Error: {error.email.join(', ')}</p>}
    <input className={`p-3 ${error && error.email ? 'border-red-400 border': ''}`} type="text" ref={emailRef} placeholder="Email Address" /></div>
    <div>{error && error.code && <p className="text-red-400 text-xs">Error: {error.code.join(', ')}</p>}
    <input className={`p-3 ${error && error.code ? 'border-red-400 border': ''}`} type="text" ref={validationCodeRef} placeholder="Validation Code" /></div>
    <div>{error && error.username && <p className="text-red-400 text-xs">Error: {error.username.join(', ')}</p>}
    <input className={`p-3 ${error && error.username ? 'border-red-400 border': ''}`} type="text" ref={usernameRef} placeholder="Username" /></div>

    <div>{error && error.location && <p className="text-red-400 text-xs">Error: {error.location.join(', ')}</p>}
    <input className={`p-3 ${error && error.location ? 'border-red-400 border': ''}`} type="text" ref={locationRef} placeholder="Location" /></div>
    <div>{error && error.password && <p className="text-red-400 text-xs">Error: {error.password.join(', ')}</p>}
    <input className={`p-3 ${error && error.password ? 'border-red-400 border': ''}`} type="password" ref={passwordRef} placeholder="Password" /></div>
    <div>{error && error.password_repeat && <p className="text-red-400 text-xs">Error: {error.password_repeat.join(', ')}</p>}
    <input className={`p-3 ${error && error.password_repeat ? 'border-red-400 border': ''}`} type="password" ref={passwordRepeatRef} placeholder="Password repeat" /></div>
    </div>

    {data && <p className="err">Resp:{JSON.stringify(data)}</p> }
    {pwError && <p className="err text-red-400">{pwError}</p> }
    <button onClick={finishRegClick} className="header-buttons m-10 text-white">{loading ? "Submitting..." : "Finish Registration"}</button>
    </div>
    </>
   )
}
