import { useEffect, useState } from "react";
import { Form, useLoaderData, useParams } from "react-router-dom";
import { CommentCard } from "../Comments/CommentCard";
import { CommentList } from "../Comments/CommentList";


// Loaderilla haetaan oikea artikkeli
export function ArticleView(){
    const {article, comments} = useLoaderData()
    const {id} = useParams()



    return (
        <div className="flex flex-col w-3/5 mx-auto flex-1 items-center">
            <div className="flex-1">
                {article ? (
                    <><h3 className="my-3 text-3xl">{article.title}</h3>
                    <p>{article.content}</p></>

                ) : (
                    <><h3 className="my-3 text-3xl">Not found</h3>
                    <p>Not found</p></>
                )}
            </div>
            <CommentList article_id={id}/>
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

    // Hae artikkelit id perusteella
    const res = await fetch(`http://localhost:3000/articles/${id}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-type": "application/json"
        }
    })

    if (!res.ok){
        console.log("Article fetch failed")
        return null
    }


    const article = await res.json()

    return {article}

}