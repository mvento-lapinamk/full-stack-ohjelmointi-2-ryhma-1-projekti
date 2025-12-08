import { useEffect, useState } from "react"


export function CommentCard({user, comment, created}){

    const [userData, setUserData] = useState()

    // Muutetaan aika kivempaan muotoon
    const date = new Date(created)
    const formatDate = date.getDate().toString() + "." + 
    date.getMonth().toString().padStart(2, "0") + "." + 
    date.getFullYear().toString().padStart(2, "0") + " " + 
    date.getHours().toString() + "." + 
    date.getMinutes().toString().padStart(2, "0") + "." + 
    date.getSeconds().toString().padStart(2, "0")

    // Haetaan kommentin kirjoittajan tiedot
    async function getUser(userId){
        const res = await fetch(`http://localhost:3000/users/${userId}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-type": "application/json"
            }
        })
        
        if (!res.ok){
            return 
        }

        return await res.json()
    }

    useEffect(() => {
        // Asetetaan kommentoijan tiedot userDataan
        getUser(user).then(data => {
            setUserData(data)
        })

    }, [])

    return (
        <div className="commentCard">
            <p className="text-start">Kommentti: {comment}</p>
            <p className="text-start">Käyttäjä: {userData ? userData.first_name : ""} {userData ? userData.last_name : ""}</p>
            <p className="text-start">Aika: {formatDate}</p>

        </div>
    )
}