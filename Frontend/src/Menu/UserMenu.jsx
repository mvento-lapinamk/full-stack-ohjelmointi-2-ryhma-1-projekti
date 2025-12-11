import { useState } from "react";
import {FaRegArrowAltCircleRight} from "react-icons/fa"
import {SlMenu} from "react-icons/sl"
import { Form, useNavigate } from "react-router-dom";


export function UserMenu({headerHeight, logoutAction, userRole}){

    // State, onko menu esillä vai ei
    const [open, setOpen] = useState(false)

    const navigate = useNavigate()

    // Menu div, saa top attribuutiksi headerin korkeuden
    return (
        <div className="ml-auto">
            <button className="btn" onClick={() => {setOpen(!open)}}>
                {open ? <FaRegArrowAltCircleRight /> : <SlMenu />}
            </button>
            <div className={`slide-menu ${open ? "open": ""}`} style={{top: headerHeight}}>
                <ul>
                    <li className="menu-item">Profiili</li>
                    {userRole === "admin" ? ( // Adminin extra osat
                        <>
                            <li className="menu-item">Hallinnoi käyttäjiä</li>
                            <li className="menu-item">Luo artikkeli</li>
                        </>
                        ) 
                        : userRole === "writer" ? ( // Kirjoittajan lisäosa
                            <>
                                <li className="menu-item" onClick={() => navigate("/article/create")}>Luo artikkeli</li>
                            </>
                        ): null
                    }
                    <Form method="post" action="/logout">
                        <li className="menu-item"><button type="submit">Kirjaudu ulos</button></li>
                    </Form>
                </ul>
            </div>
        </div>
    )
}