import { useEffect, useState } from "react"


// Yksittäinen etusivulla näytettävä artikkeli
export function ArticleCard({title, content, created, userId}){

    // Id:llä haettavan käyttäjän state
    const [userData, setUserData] = useState()

    // Haetaan artikkelin kirjoittaja
    async function getUser(id){
        const res = await fetch(`http://localhost:3000/users/${id}`)

        // Jos käyttäjää ei löydy palautetaan tyhjä ja näytetään ruudulla "tuntematon"
        if (!res.ok){
            return
        }

        return await res.json()
    }

    useEffect(() => {
        getUser(userId).then(data => {
            setUserData(data)
        })

    }, [])

    // Formatoidaan aika
    const date = new Date(created)
    const formatDate = date.getDate().toString() + "." + 
    date.getMonth().toString() + "." + 
    date.getFullYear().toString() + " " + 
    date.getHours().toString() + "." + 
    date.getMinutes().toString() + "." + 
    date.getSeconds().toString()

    // Content voisi olla tässä tapauksessa lyhyt selitys, ei koko sisältö
    return(
        <div>
            <h2>{title}</h2>
            <p className="my-5">{content}</p>
            <p className="text-start">Kirjoittanut: {userData ? userData.first_name : "Tuntematon"}</p>
            <p className="text-start">{formatDate}</p>
        </div>
    )
}