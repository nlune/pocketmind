import { useEffect, useState } from "react";
import LoginForm from "../components/LoginForm";
import ForgotPasswordForm from "../components/ForgetPasswordForm";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


export default function LoginPage(){
    const nav = useNavigate()
    const [forgotpw, setForgotPW] = useState(false)
    let token = useSelector(s => s.User.accessToken)
    if (!token) {
      token = localStorage.getItem("token")
  } 

    useEffect(() => {
        if (token) {
            nav('/home/')
        }
    }, [token, location.state])


   return (
    <>
    {!forgotpw && <LoginForm setForgotPW={setForgotPW}/>}
    {forgotpw && <ForgotPasswordForm/>}

    </>
   )
}
