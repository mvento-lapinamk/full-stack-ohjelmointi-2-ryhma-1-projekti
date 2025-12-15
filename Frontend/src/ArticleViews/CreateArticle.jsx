import { Form, redirect, useActionData, useLoaderData } from "react-router-dom";


export function CreateArticle(){

    // Actionin palauttama tieto, jos virhe
    const error = useActionData()


    return (
        <>
            <div className="mx-auto mt-5 w-3/5 flex-1">
                <Form action="/article/create" method="post" className="flex flex-col h-100">
                    <label htmlFor="createArticleTitle" className="mb-2 text-start text-2xl">Otsikon teksti</label>
                    <input id="createArticleTitle" type="text" name="title" placeholder="Artikkelin otsikko"  className="input"/>
                    <label htmlFor="createArticleDescription" className="mt-4 mb-2 text-start text-2xl">Artikkelin kuvaus</label>
                    <input id="createArticleDescription" type="text" name="description" placeholder="Artikkelin kuvaus"  className="input"/>
                    <label htmlFor="createArticleContent" className="mt-4 mb-2 text-start text-2xl">Artikkelin sisältö</label>
                    <textarea id="createArticleContent" name="content" placeholder="Artikkelin runko" rows="10" className="articleContent"/>
                    <button type="submit" className="btn my-5 size-fit">Julkaise</button>
                </Form>
                {error ? <p className="error">{error.message}</p> : <p className="h-6"></p>}
            </div>
        </>
    )
}

// Uuden artikkelin tallentaminen
export async function CreateArticleAction({ request }){
    const formData = await request.formData()
    const data = Object.fromEntries(formData)

    const res = await fetch("http://localhost:3000/articles", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(data)
    })

    // Virhe tilanteissa palauta viesti takaisin komponentille
    if (!res.ok){
        if (res.status == 401){
            return {message: "Sinulle ei ole oikeuksia julkaista artikkelia"}
        }

        else {
            return {message: "Artikkelin julkaisu epäonnistui"}
        }
    }

    return redirect("/")
}

// Uuden artikkelin tallentaminen
export async function CreateArticleLoader(){
    const res = await fetch("http://localhost:3000/users/whoami", {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-type": "application/json"
        }
    })

    // Virhe tilanteissa palauta viesti takaisin komponentille
    if (!res.ok){
        if (res.status == 401){
            throw new Response("Ei oikeuksia päästä sivulle", {status: res.status})
        }
        else {
            throw new Response("Palvelussamme saattaa olla ongelma", {status: res.status})
        }

    }

    const user = await res.json()

    if (user.role == "user"){
        throw new Response("Ei oikeuksia päästä sivulle", {status: res.status})
    }
}