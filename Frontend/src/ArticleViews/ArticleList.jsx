import { useEffect, useRef, useState } from "react"
import { ArticleCard } from "./ArticleCard"
import { Link, useLoaderData } from "react-router-dom"


// Etusivun listaus ladatuista artikkeleista
export function ArticleList(){

    // Kaikille artikkeleille state
    const articles = useLoaderData()



    // Mäpätään haetut artikkelit artikkelikomponentteihin
    return (
        <>
            {articles.map((article, key) => { 
                // Artikkelia klikataa -> ohjataan sivulle, jossa haetaan artikkelin tiedot
                return( 
                    <Link to={`./article/${article.id}`} key={key} className="mx-auto my-5 w-2/5 border-2 p-5">
                        <ArticleCard articleData={article} />
                    </Link>
                )
            })}
        </>
    )
}

// Lataa artikkelit
export async function ArticleListLoader(){
    const res = await fetch("http://localhost:3000/articles")


    if (!res.ok){
        throw new Response("Artikkelejä ei löydy")
    }

    const data = await res.json()
    return data
}
