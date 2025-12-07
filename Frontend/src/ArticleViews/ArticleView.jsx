import { useEffect, useState } from "react";
import { Form, useLoaderData, useParams } from "react-router-dom";
import { CommentCard } from "../Comments/CommentCard";


// Ota etusivulta lähetetty state vastaan useLocation avulla
export function ArticleView(){
    const {article, comments} = useLoaderData()
    // const [comments, setComments] = useState([])
    const {id} = useParams()


    async function getArticle(){
        const response = await fetch(`http://localhost:3000/articles/${id}`)
        const data = await response.json()
        return data
    }
    
    async function getComments(){
        const response = await fetch(`http://localhost:3000/comments/${id}`)
        const data = await response.json()
        return data
    }

    useEffect(() => {
    }, [])


    return (
        <div className="flex flex-col w-3/5 mx-auto h-100 items-center">
            <div className="flex-1">
            {article ? (
                <><h3 className="my-3 text-3xl">{article.title}</h3>
                <p>{article.content}</p></>

            ) : (
                <><h3 className="my-3 text-3xl">Not found</h3>
                <p>Not found</p></>
            )}
            </div>
            <div className="commentSection size-fit px-5">
                {comments.map((comment) => {
                    return (<CommentCard key={comment.id} user={comment.user_id} comment={comment.content} created={comment.created} />)
                })}
            </div>
            <Form method="post" action={`/article/${id}`}>
                <input type="text" name="content" placeholder="Leave comment" className=""/>
                <button className="btn ml-2">Lähetä kommentti</button>
            </Form>
        </div>
    )
}
// Postaa uusi kommentti
export async function PostCommentAction({request, params}){
    const articleId = parseInt(params.id)
    const formdata = await request.formData()
    const { content } = Object.fromEntries(formdata)
    const requestBody = {
        content: content,
        article_id: articleId
    }

    
    const res = await fetch(`http://localhost:3000/comments`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(requestBody)
    })

    if (!res.ok){
        console.log("Comment fail")
        
        return
    }
    console.log("Comment send")
}

// Lataa artikkelin ja kommentit
export async function ArticleLoader({params}){
    const id = params.id

    const resArticle = await fetch(`http://localhost:3000/articles/${id}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-type": "application/json"
        }
    })
    const resComments = await fetch(`http://localhost:3000/comments/${id}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-type": "application/json"
        }
    })

    if (!resArticle.ok){
        console.log("Article fetch failed")
    }
    if (!resComments.ok){
        console.log("Comments fetch failed")
    }

    const article = await resArticle.json()
    const comments = await resComments.json()

    return {article, comments}

}