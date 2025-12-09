import { useEffect, useState } from "react"
import {FaRegTrashAlt} from "react-icons/fa"


export function CommentCard({comment, webUser, onDelete}){

    const [userData, setUserData] = useState({error: "Not found"})

    // Tarkista onko käyttäjä sama kuin kommentin jättänyt. 
    // Tällöin näytetään roskis jolla kommentin voi poistaa
    const sameUser = false
    if (webUser.user){
        const sameUser = comment.user_id == webUser?.user.id

    }

    // Muutetaan aika kivempaan muotoon
    const date = new Date(comment.created)
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

    async function deleteComment(){
        const res = await fetch(`http://localhost:3000/comments/${comment.id}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-type": "application/json"
            }
        })

        if (!res.ok){
            return alert("Kommentin poisto epäonnistui")
        }

        // CommentList komponentin funktio päivittää comments-staten
        onDelete()
    }

    useEffect(() => {
        // Asetetaan kommentoijan tiedot userDataan
        getUser(comment.user_id).then(data => {
            setUserData(data)
        })

    }, [])

    return (
        <div className="commentCard">
            <p className="text-start">Kommentti: {comment.content}</p>
            <p className="text-start">Käyttäjä: {userData ? `${userData.first_name} ${userData.last_name}`: userData.error}</p>
            <div className="flex items-center">
                <p className="text-start inline size-fit">Aika: {formatDate}</p>
                {sameUser ? <button className="ml-auto size-fit cursor-pointer" onClick={(deleteComment)}> <i> <FaRegTrashAlt/> </i> </button> : <></>}
            </div>

        </div>
    )
}