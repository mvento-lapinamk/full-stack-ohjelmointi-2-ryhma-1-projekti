// Tuodaan data access layer
import { supabase } from "../db/db.js"

// Artikkelien Service luokka
export class ArticleService{

    // Haetaan kaikki artikkelit
    async GetArticles(){
        // Query tietokantaan
        const articles = await supabase.from('articles').select('*')

        // Jos kantahaku on 200 OK ja data array ei ole tyhjä, palautetaan artikkelit
        if (articles.status === 200 && articles.data.length !== 0) {
            return articles.data
        }
        // Jos kantahaku on 200 OK mutta data array on tyhjä, palautetaan viesti
        else if (articles.status === 200 && articles.data.length === 0) {
            return("Articles not found")
        }
        // Muissa tapauksissa palautetaan virheviesti
        else {
            return("Something went wrong")
        }
    }

    // Haetaan tietty artikkeli id:n perusteella
    async GetArticleById(id){
        // Query tietokantaan
        const article = await supabase.from('articles').select('*').eq('id', [id])

        // Jos kantahaku on 200 OK ja data array ei ole tyhjä, palautetaan artikkeli
        if (article.status === 200 && article.data.length !== 0) {
            return article.data
        }
        // Jos kantahaku on 200 OK mutta data array on tyhjä, palautetaan viesti
        else if (article.status === 200 && article.data.length === 0) {
            return("Article not found")
        }
        // Muissa tapauksissa palautetaan virheviesti
        else {
            return("Something went wrong")
        }
    }

    // Luodaan uusi artikkeli
    async CreateArticle(createArticleReq, reqUser){
        // Yritetään lisätä uusi artikkeli
        try{
            // Query tietokantaan
            const insertedArticle = await supabase.from('articles').insert({
                title: createArticleReq.title,
                content: createArticleReq.content,
                user_id: reqUser
            })

            // Palautetaan lisäyksen status
            return (insertedArticle.status + ' ' + insertedArticle.statusText)

        } 
        // Jos jokin menee pieleen, palautetaan virheviesti
        catch (err){
            throw new Error(err.message)
        }
    }
}