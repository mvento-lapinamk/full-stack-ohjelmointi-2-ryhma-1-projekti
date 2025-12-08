import { useEffect, useRef, useState } from "react"
import { ArticleCard } from "./ArticleCard"
import { Link } from "react-router-dom"


// Etusivun listaus ladatuista artikkeleista
export function ArticleList(){

    // Kaikille artikkeleille state
    const [articles, setArticles] = useState([])

    // Funktio artikkeleiden haulle
    async function loadedArticles() {
        const res = await fetch("http://localhost:3000/articles")
        const data = await res.json()
        return data

    }

    useEffect(() => {
        
        loadedArticles().then(data => {
            setArticles(data)
            
        })

    }, [])

    // Mäpätään haetut artikkelit artikkelikomponentteihin
    return (
        <>
            {articles.map((article, key) => {
                // Artikkelia klikataa -> ohjataan sivulle, jossa haetaan artikkelin tiedot
                return( 
                    <Link to={`./article/${article.id}`} key={key} className="mx-auto my-5 w-2/5 border-2 p-5">
                        <ArticleCard title={article.title} content={article.content} created={article.created} userId={article.user_id} />
                    </Link>
                )
            })}
        </>
    )
}
