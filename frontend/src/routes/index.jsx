
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import HomePage from "../pages/Home";
import AudioInputPage from "../pages/AudioInputPage";

export default function MainRoutes() {


    return (
        <>
        <Routes>
        <Route element={<Layout/>}>
            <Route path='/' element={<HomePage/>}/>
            <Route path='/audio-input/' element={<AudioInputPage/>}/>
            
        </Route >
        </Routes>
        </>
    )
}