import { useEffect } from "react"
import { useState } from "react"
import { CommentCard } from "./CommentCard"
import { useRouteLoaderData } from "react-router-dom"



export function CommentList({article_id}){
    // Tähän haetaan kaikki kommentit
    const [comments, setComments] = useState([])

    // Headerin tarkistama käyttäjä
    const user = useRouteLoaderData("root")
    
    // Haetaan kommentit
    async function getComments(id){
        const res = await fetch(`http://localhost:3000/comments/${id}`, {
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

    // Kommenttien päivitys, jos kommenttikortti poistetaan
    function updateComments(){
        getComments(article_id).then(data => {
            setComments(data)
        })
    }

    useEffect(() => {

        getComments(article_id).then(data => {
            setComments(data)
        })

    }, [])

    return (
        <div className="commentsSection">
            {comments ? comments.map((comment) => {
                return (<CommentCard key={comment.id} comment={comment} webUser={user} onDelete={updateComments} />)
            }) : <p>Article has no comments</p>}
        </div>
    )
}