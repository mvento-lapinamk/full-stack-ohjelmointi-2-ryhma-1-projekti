import { useEffect, useState } from "react";
import { Form, redirect, useActionData, useLoaderData, useLocation, useParams, useRouteLoaderData } from "react-router-dom";
import { CommentList } from "../Comments/CommentList";
import {FaRegTrashAlt} from "react-icons/fa"


// Loaderilla haetaan oikea artikkeli
export function ArticleView(){

    
    // Locationin statessa kirjoittajan id
    const articleUserId = useLocation()
    
    // Tähän stateen haetaan kirjoittajan tiedot articleUserId.taten avulla
    const [articleUser, setArticleUser] = useState([])
    
    // Käyttäjän id haku
    const user = useRouteLoaderData("root")
    let sameUser = false

    // Jos käyttäjä kirjoittanut artikkelin. Annetaan mahdollisuus muokata tai poistaa.
    if(user){
        if (user.id === articleUserId.state){
            sameUser = true
        }
        else{
            sameUser = false
        }   
    }

    // Loader hakee artikkelin
    const article = useLoaderData()
    // Article id
    const {id} = useParams()

    // Actionstä palautuu kommentoinnin tulos
    const actionData = useActionData()


    // Hae artikkelin kirjoittanut käyttäjä
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
        getUser(articleUserId.state).then(data => {
            setArticleUser(data)
        })
    },[])



    return (
        <div className="flex flex-col w-3/5 mx-auto flex-1 items-center">
            <div className="flex-1 flex flex-col w-full">
                {article ? (
                    <><h3 className="my-3 text-3xl">{article.title}</h3>
                    <p>{article.content}</p></>

                ) : (
                    <><h3 className="my-3 text-3xl">Not found</h3>
                    <p>Not found</p></>
                )}
                <div className="mt-auto flex">
                    <p className="mr-auto">Kirjoittaja: {articleUser.first_name} {articleUser.last_name}</p>
                    { sameUser ? <>
                        <button className="ml-auto size-fit cursor-pointer"> <i> <FaRegTrashAlt/> </i> </button>
                        <button className="ml-5 size-fit cursor-pointer"> <i> <FaRegTrashAlt/> </i> </button> </> : <></>}
                </div>
            </div>
            <CommentList article_id={id}/>
            {actionData ? <p className="error">{actionData.message}</p> : <p className="h-6"></p>}
            <Form method="post" action={`/article/${id}`} className="mb-2">
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
        if (res.status === 401)
            return {message: "Kirjaudu sisään kommentoidaksesi"}
        
        return {message: "Jokin meni pieleen"}
    }
    return redirect(`/article/${articleId}`)
}

// Lataa artikkelin
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

    return article

}