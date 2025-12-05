import { useEffect } from "react"
import "../App.css"

function Header(){


    
    return <>
    
        <header className="w-full p-5 flex justify-evenly bg-green-600">
            <div className="flex justify-between items-center w-1/3">
                <div><p>Kotisivu</p></div>
                <div><p>Uutiset</p></div>
                <div><p>Urheilu</p></div>
                <div><p>Kulttuuri</p></div>
            </div>
            <div className="w-1/3">
                <h1>Lehti</h1>
            </div>
            <div className="flex w-1/3 justify-center items-center justify-end">
                <a href="/login" >
                    <button rel="/login">Kirjaudu sisään</button>
                </a>
            </div>
        </header>
    </>
}
export default Header