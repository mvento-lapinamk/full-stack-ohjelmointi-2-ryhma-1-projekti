import { useEffect, useRef, useState } from "react"
import logo from "../assets/react.svg"
import { Link, redirect, useLoaderData, useNavigate } from "react-router-dom"
import { UserMenu } from "../Menu/UserMenu"

export function Header(){

    // Lue header korkeus menuita varten
    const [headerHeight, setHeaderHeight] = useState(0)
    const headerRef = useRef()

    // Loaderin palauttama tieto
    const data = useLoaderData()
    const navigate = useNavigate()
    
    // Lue headerin korkeus, joka annetaan menulle
    useEffect(() => {
        if (headerRef.current){

            setHeaderHeight(headerRef.current.clientHeight)
        }

    }, [headerHeight])

    
    return <>
    
        <header ref={headerRef} className="w-full p-5 flex bg-zinc-600">
            <div className="flex-none">
                <Link to={"/"}>
                    <h1 className="mx-5">Digilehti</h1>
                </Link>
            </div>
            <div className="flex-1 text-right pr-5">
                <p className="leading-none">Hei {data.username ? data.username : data.message}!</p>
            </div>

            {data.role ? <UserMenu headerHeight={headerHeight} logoutAction={LogoutAction} userRole={data.role} /> : <button className="ml-auto btn flex" onClick={() => navigate("/login")}>Kirjaudu / Luo tunnus</button>}

            
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
        
        return user

    } catch (err){
        console.log(err.message)
    }
}

    // Kirjaudu ulos
export async function LogoutAction(){
    console.log("logout action")
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
    return redirect("/")
}