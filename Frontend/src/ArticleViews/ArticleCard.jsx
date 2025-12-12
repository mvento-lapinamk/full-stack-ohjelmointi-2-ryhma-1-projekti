import { useEffect, useState } from "react"
import { FormatTime } from "../Components/FormatTime"


// Yksittäinen etusivulla näytettävä artikkeli
export function ArticleCard({title, content, created, userId}){

    // Id:llä haettavan käyttäjän state
    const [userData, setUserData] = useState({error: "Not found"})

    // Haetaan artikkelin kirjoittaja
    async function getUser(id){
        const res = await fetch(`http://localhost:3000/users/${id}`, {
            method: "GET",
            include: "credentials",
            headers: {
                "Content-type": "application/json"
            },
        })

        // Jos käyttäjää ei löydy palautetaan tyhjä ja näytetään ruudulla "tuntematon"
        if (!res.ok){
            const data = await res.json()
            return data
        }

        return await res.json()
    }

    useEffect(() => {
        getUser(userId).then(data => {
            setUserData(data)
        })
        
    }, [])

    // Formatoidaan aika
    const formatDate = FormatTime(created)

    // Content voisi olla tässä tapauksessa lyhyt selitys, ei koko sisältö
    return(
        <div>
            <h2>{title}</h2>
            <p className="my-5">{content}</p>
            <p className="text-start">Kirjoittanut: {userData?.first_name && userData?.last_name ? `${userData.first_name} ${userData.last_name}` : userData.error}</p>
            <p className="text-start">{formatDate}</p>
        </div>
    )
}