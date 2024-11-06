
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import HomePage from "../pages/Home";
import AudioInputPage from "../pages/AudioInputPage";
import TransactionForm from "../pages/TransactionForm";
import ProtectedRoutes from "./Protector";
import LoginPage from "../pages/Login";
import CamInputPage from "../pages/CamInputPage.jsx";
import RegistrationPage from "../pages/Registration.jsx";
import ProfilePage from "../pages/Profile.jsx";
import NotFoundPage from "../pages/NotFound.jsx";
import PasswordResetPage from "../pages/PasswordReset.jsx";


export default function MainRoutes() {


    return (
        <>
        <Routes>
        <Route path='/registration/' element={<RegistrationPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route element={<Layout/>}>

        <Route path="" element={<ProtectedRoutes />}>
            <Route path='/' element={<HomePage/>}/>
            <Route path='/audio-input/' element={<AudioInputPage/>}/>
            <Route path='/new-transaction/' element={<TransactionForm/>}/>
        </Route>

            {/* <Route path="*" element={<NotFound/>} /> */}

            <Route path='/camera-input/' element={<CamInputPage/>}/>
            <Route path='/password-reset/' element={<PasswordResetPage/>}/>
            <Route path='/profile/' element={<ProfilePage/>}/>
            <Route path='/not-found/' element={<NotFoundPage/>}/>
        </Route >
        </Routes>
        </>
    )
}