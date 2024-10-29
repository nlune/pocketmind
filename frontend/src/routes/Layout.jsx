import {Outlet} from "react-router-dom";

export default function Layout() {

    return (
        <div className="layout-container">
            <p>layout</p>

            <Outlet/>
            

        </div>
    )
}