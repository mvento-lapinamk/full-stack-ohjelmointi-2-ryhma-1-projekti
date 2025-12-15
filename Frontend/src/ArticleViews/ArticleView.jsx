import { useEffect, useState } from "react";
import { Form, Link, redirect, useActionData, useLoaderData, useNavigate, useParams, useRouteLoaderData } from "react-router-dom";
import { CommentList } from "../Comments/CommentList";
import {FaRegTrashAlt} from "react-icons/fa"
import { LuPenTool } from "react-icons/lu"
import { FormatTime } from "../Components/FormatTime"


// Loaderilla haetaan oikea artikkeli
export function ArticleView(){
    // Artikkelin poiston jälkeen ohjataan etusivulle
    const navigate = useNavigate()

    // Tähän stateen haetaan kirjoittajan tiedot articleUserId.taten avulla
    const [articleUser, setArticleUser] = useState([])
    
    // Käyttäjän id haku
    const user = useRouteLoaderData("root")
    let sameUser = false

    // Jos käyttäjä kirjoittanut artikkelin. Annetaan mahdollisuus muokata tai poistaa.
    if(user){
        if (user.id === articleUser.id || user.role === "admin"){
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

    // Functio artikkelin poistoon
    async function DeleteArticle(){

        console.log("Poistetaan artikkeli", id)
        const res = await fetch(`http://localhost:3000/articles/${id}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (!res.ok){
            console.log(res)
            return alert("Artikkelin poisto epäonnistui")
        }

        return navigate("/")
    }

    // Hae artikkelin kirjoittanut käyttäjä
    async function getUser(userid){
        const res = await fetch(`http://localhost:3000/users/${userid}`, {
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

        getUser(article.user_id).then(data => {
            setArticleUser(data)
        })
    },[])

    // Formatoidaan aika
    const formatDate = FormatTime(article.created)

    return (
        <div className="flex w-4/5 flex-col mx-auto flex-1 items-center text-start">
            <div className="w-3/5">
                <h3 className="mb-3 text-start underline"><a href="/">Palaa etusivulle</a></h3>
            </div>
            <div className="article flex-1 flex flex-col w-full">
                {article ? (
                    <>
                        <h1 className="my-3 text-3xl">{article.title}</h1>
                        <img className="pt-6 pb-6" src={article.image_url} />
                        <p className="my-5 italic">{article.description}</p>
                        <p className="text-start">{article.content}</p>
                    </>

                ) : (
                    <><h3 className="my-3 text-3xl">Not found</h3>
                    <p>Not found</p></>
                )}
                <div className="mt-auto pt-10">
                    <p className="text-start text-sm font-bold">{articleUser.first_name} {articleUser.last_name}</p>
                    <p className="text-start text-sm italic">{formatDate}</p>
                    { sameUser ? <>
                    <Link to={`/article/${id}/modify`} state={article}>
                        <button className="ml-auto size-fit cursor-pointer"> <i> <LuPenTool /> </i> </button>
                    </Link>
                    <button className="ml-5 size-fit cursor-pointer" onClick={DeleteArticle}> <i> <FaRegTrashAlt/> </i> </button> </> : <></>}
                </div>
            </div>
            <CommentList article_id={id}/>
            {actionData ? <p className="error">{actionData.message}</p> : <p className="h-6"></p>}
            <div className="flex items-start">
                <Form method="post" action={`/article/${id}`} className="mb-2">
                    <input type="text" name="content" placeholder="Kirjoita kommentti" className=""/>
                    <button className="btn ml-2">Lähetä kommentti</button>
                </Form>
            </div>
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

