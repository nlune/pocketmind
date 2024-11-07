
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
import TransactionsPage from "../pages/Transactions.jsx";
import CamInputPageTest from "../pages/sample_cam.jsx";
import GraphsReportsPage from "../pages/AnalysisPage.jsx";



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
            <Route path='/cam-input/' element={<CamInputPage/>}/>
            <Route path='/new-transaction/' element={<TransactionForm/>}/>
            <Route path="/transactions/" element={<TransactionsPage/>}/>
            <Route path="/reports/" element={<GraphsReportsPage/>}/>
            <Route path='/profile/' element={<ProfilePage/>}/>
        </Route>

            {/* <Route path='/cam-input-test/' element={<CamInputPageTest/>}/> */}
            <Route path='/registration/' element={<RegistrationPage/>}/>
            <Route path='/password-reset/' element={<PasswordResetPage/>}/>
            <Route path='*' element={<NotFoundPage/>}/>
        </Route >
        </Routes>
        </>
    )
}