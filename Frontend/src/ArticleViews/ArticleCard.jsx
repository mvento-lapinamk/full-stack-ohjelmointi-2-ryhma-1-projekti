import { useEffect, useState } from "react"
import { FormatTime } from "../Components/FormatTime"


// Yksittäinen etusivulla näytettävä artikkeli
export function ArticleCard({articleData}){

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
        getUser(articleData.user_id).then(data => {
            setUserData(data)
        })
        
    }, [])

    // Formatoidaan aika
    const formatDate = FormatTime(articleData.created)

    // Content voisi olla tässä tapauksessa lyhyt selitys, ei koko sisältö
    return(
        <div className="articleCard p-5">
            <h1 className="text-start">{articleData.title}</h1>
            <img className="pt-6 pb-6" src={articleData.image_url} />
            <p className="my-5 text-start">{articleData.description} <span className="underline">Lue lisää...</span></p>
            <p className="text-start text-sm italic">Kirjoittanut: {userData?.first_name && userData?.last_name ? `${userData.first_name} ${userData.last_name}` : userData.error}</p>
            <p className="text-start text-sm italic">{formatDate}</p>
        </div>
    )
}