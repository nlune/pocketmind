import { useState } from "react";
import LoginForm from "../components/LoginForm";
import ForgotPasswordForm from "../components/ForgetPasswordForm";


export default function LoginPage(){
    const [forgotpw, setForgotPW] = useState(false)

   return (
    <>
    {!forgotpw && <LoginForm setForgotPW={setForgotPW}/>}
    {forgotpw && <ForgotPasswordForm/>}

    </>
   )
}
