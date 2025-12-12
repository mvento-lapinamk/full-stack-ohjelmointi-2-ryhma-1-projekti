import { useEffect, useState } from "react"
import { useLoaderData, useRouteLoaderData } from "react-router-dom"
import { FormatTime } from "../Components/FormatTime"


export function ProfileView(){

    // Käytä headerin hakemaa käyttäjä dataa
    const userData = useRouteLoaderData("root")
    // State käyttäjän laajemmille tiedoille
    const [user, setUser] = useState([])

    const [formattedTime, setFormattedTime] = useState()

    // Hae käyttäjän kaikki tiedot
    async function getUserData(userId){
        console.log("GetuserData", userId)
        const res = await fetch(`http://localhost:3000/users/${userId}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-type": "application/json"
            },
        })

        if (!res.ok){

            throw new Response("Profiilia ei voida hakea")
        }

        return await res.json()
    }

    useEffect(() => {
        getUserData(userData.id).then(data => {
            setUser(data)
            setFormattedTime(FormatTime(data.created))
        })

    }, [])

    return (
        <div>
            <h1>Profiilisi</h1>
            <p>{user.first_name ? user.first_name : ""} {user.last_name ? user.last_name : ""}</p>
            <p>Käyttäjätunnus: {user.username}</p>
            <p>Käyttäjä luotu: {formattedTime}</p>
            <button className="btn my-5">Vaihda salasana</button>
        </div>
    )
}
