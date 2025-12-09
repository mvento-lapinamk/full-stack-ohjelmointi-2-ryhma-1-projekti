import { useEffect } from "react"
import logo from "../assets/react.svg"
import { Link, redirect, useLoaderData, useNavigate } from "react-router-dom"

export function Header(){

    // Loaderin palauttama tieto
    const data = useLoaderData()
    
    // Navigointi rekisteröitymis napilla siirtymiseen
    const navigate = useNavigate()

    // Kirjaudu ulos
    async function LogoutAction(){
        const res = await fetch("http://localhost:3000/users/logout", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-type": "application/json"
            }
        })
        
        if (!res.ok){
            console.log("error")
            return
        }
        
        
        // Ohjataan takaisin etusivulle, jolloin header päivittyy
        return navigate("/")
    }
    
    return <>
    
        <header className="w-full p-5 flex bg-zinc-600">
            <img src={logo} alt="logo" />
            <Link to={"/"}>
                <h1 className="mx-5">Otsikko</h1>
            </Link>

            <p className="leading-none">Terve {data.user ? data.user.username : data.message}</p>

            {data.user ? (

                <button className="ml-auto btn" onClick={LogoutAction}>Ulos kirjaudu</button>
            ) : (
                
                <button className="ml-auto btn" onClick={() => navigate("/login")}>Kirjaudu</button>
            )}
            
        </header>
    </>
}


// Loader tarkastaa onko käyttäjä kirjautunut sisään
export async function HeaderLoader(){
    try{

        const res = await fetch("http://localhost:3000/users/whoami", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-type": "application/json"
            },
        })
    
        // Jos tokenin käyttäjää ei löydy
        if (!res.ok){
            return {message: "Vierailija"}
        }
    
        // Palautetaan käyttäjän tiedot
        const user = await res.json()
        return {user}

    } catch (err){
        console.log(err.message)
    }
}