
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import HomePage from "../pages/Home";
import AudioInputPage from "../pages/AudioInputPage";
import CamInputPage from "../pages/CamInputPage.jsx";
import LoginPage from "../pages/Login.jsx";
import RegistrationPage from "../pages/Registration.jsx";
import ProfilePage from "../pages/Profile.jsx";
import NotFoundPage from "../pages/NotFound.jsx";
import PasswordResetPage from "../pages/PasswordReset.jsx";


export default function MainRoutes() {


    return (
        <>
        <Routes>
        <Route element={<Layout/>}>
            <Route path='/' element={<HomePage/>}/>
            <Route path='/audio-input/' element={<AudioInputPage/>}/>
            <Route path='/camera-input/' element={<CamInputPage/>}/>
            <Route path='/login/' element={<LoginPage/>}/>
            <Route path='/registration/' element={<RegistrationPage/>}/>
            <Route path='/passwordreset/' element={<PasswordResetPage/>}/>
            <Route path='/profile/' element={<ProfilePage/>}/>
            <Route path='/notfound/' element={<NotFoundPage/>}/>
        </Route >
        </Routes>
        </>
    )
}