import { Form, redirect, useActionData, useLocation, useParams } from "react-router-dom"
import { ErrorPage } from "../CustomException/ErrorPage"
import { useEffect, useState } from "react"


export function ModifyArticle(){

    const articleState = useLocation()
    const [article, setArticle] = useState([])

    const error = useActionData()

    const {id} = useParams()

    useEffect(() => {
        setArticle(articleState.state)
    }, [])

    return (
        <>{ article ?
            <div className="mx-auto mt-5 w-3/5 flex-1">
                <Form action={`/article/${id}/modify`} method="patch" className="flex flex-col h-100">
                    <input type="hidden" value={JSON.stringify(article)} name="defaultArticle" />
                    <label htmlFor="modifyArticleTitle" className="text-2xl">Otsikon teksti</label>
                    <input id="modifyArticleTitle" type="text" name="newTitle" defaultValue={article.title}  className="input" />
                    <label htmlFor="modifyArticleDescription" className="text-2xl">Otsikon teksti</label>
                    <input id="modifyArticleDescription" type="text" name="newDescription" defaultValue={article.description}  className="input" />
                    <label htmlFor="modifyArticleContent" className="text-2xl">Artikkelin sisältö</label>
                    <textarea id="modifyArticleContent" name="newContent" placeholder="Artikkelin runko" defaultValue={article.content} className="articleContent"/>
                    <button type="submit" className="btn my-5 size-fit">Lataa artikkeli</button>
                </Form>
                { error ? <p className="error">{error.message}</p> : <p className="h-6"></p> }
            </div>
            : <ErrorPage />
        }
        </>
    )
}

export async function ModifyArticleAction({ request }){
    try{

        const formData = await request.formData()
        const {defaultArticle, newTitle, newDescription, newContent} = Object.fromEntries(formData)
        const parsedDefaultArticle = JSON.parse(defaultArticle)
        const patchBody = {
            title: newTitle ? newTitle : parsedDefaultArticle.title,
            description: newDescription ? newDescription : parsedDefaultArticle.description,
            content: newContent ? newContent : parsedDefaultArticle.content
        }

    
        const res = await fetch(`http://localhost:3000/articles/${parsedDefaultArticle.id}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(patchBody)
        })
    
        if (!res.ok){
            return {message: "Artikkelin päivittäminen ei onnistunut"}
        }
        console.log(parsedDefaultArticle.id)

        return redirect(`/article/${parsedDefaultArticle.id}`)
        
    } catch (err){
        console.log(err)
    }
}