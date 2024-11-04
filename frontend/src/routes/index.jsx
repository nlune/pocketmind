
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import HomePage from "../pages/Home";
import AudioInputPage from "../pages/AudioInputPage";
import TransactionForm from "../pages/TransactionForm";
import ProtectedRoutes from "./Protector";
import LoginPage from "../pages/Login";

export default function MainRoutes() {


    return (
        <>
        <Routes>
        <Route element={<Layout/>}>

        <Route path="" element={<ProtectedRoutes />}>
            <Route path='/' element={<HomePage/>}/>
            <Route path='/audio-input/' element={<AudioInputPage/>}/>
            <Route path='/new-transaction/' element={<TransactionForm/>}/>
        </Route>

            <Route path="/login" element={<LoginPage/>}/>
            {/* <Route path="*" element={<NotFound/>} /> */}


        </Route >
        </Routes>
        </>
    )
}