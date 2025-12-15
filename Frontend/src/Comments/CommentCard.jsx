import { useEffect, useState } from "react"
import {FaRegTrashAlt} from "react-icons/fa"
import { FormatTime } from "../Components/FormatTime"


export function CommentCard({comment, webUser, onDelete}){

    const [userData, setUserData] = useState({error: "Not found"})

    // Tarkista onko käyttäjä sama kuin kommentin jättänyt. 
    // Tällöin näytetään roskis jolla kommentin voi poistaa
    let sameUser = false
    if (webUser?.id){
        sameUser = comment.user_id == webUser.id
        
    }

    // Muutetaan aika kivempaan muotoon
    const formatDate = FormatTime(comment.created)

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
            console.log("Error", res.error)
            return {error: "User not found"}
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

        console.log(res)
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
            <p className="text-start font-bold">{userData ? `${userData.username}`: userData.error}</p>
            <p className="text-start inline size-fit text-sm">{formatDate}</p>
            <p className="h-3"></p>
            <p className="text-start">{comment.content}</p>
            
            <div className="flex">
                {sameUser ? <button className="ml-auto size-fit cursor-pointer" onClick={(deleteComment)}> <i> <FaRegTrashAlt/> </i> </button> : <></>}
            </div>

            <p className="h-6"></p>

        </div>
    )
}

