import { useEffect } from "react"
import logo from "../assets/react.svg"
import { Link, redirect, useLoaderData, useNavigate } from "react-router-dom"

export function Header(){

    let user  = useLoaderData()
    const navigate = useNavigate()

    
    return <>
    
        <header className="w-full p-5 flex bg-zinc-600">
            <img src={logo} alt="logo" />
            <Link to={"/"}>
                <h1 className="ml-5">Otsikko</h1>
            </Link>

            {/* user ? (

                <button className="ml-auto btn" onClick={LogoutAction}>Ulos kirjaudu</button>
            ) : (
                
                <button className="ml-auto btn" onClick={() => navigate("/login")}>Kirjaudu</button>
            )*/}
            <button className="ml-auto btn" onClick={LogoutAction}>Ulos kirjaudu</button>
                
            <button className="ml-auto btn" onClick={() => navigate("/login")}>Kirjaudu</button>
   
            
        </header>
    </>
}

// Kirjaudu ulos
export async function LogoutAction(){
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
    
    const response = await res.json()
    
    console.log(response)
    return redirect("/")
}

// Loader tarkastaa onko käyttäjä kirjautunut sisään
export async function HeaderLoader(){
    const res = await fetch("http://localhost:3000/users/me", {
        method: "GET",
        credentials: "include"
    })

    if (!res.ok){
        console.log("Res not ok")
        return {user: null}
    }

    const user = await res.json()
    return {user: user}
}