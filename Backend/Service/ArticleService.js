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
            return article.data[0]
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
    async CreateArticle(createArticleReq, user){

        // Yritetään lisätä uusi artikkeli
        try{
            // Query tietokantaan
            const insertedArticle = await supabase.from('articles').insert({
                title: createArticleReq.title,
                content: createArticleReq.content,
                user_id: user.userId
            })

            // Palautetaan lisäyksen status
            return (insertedArticle.statusText)

        } 
        // Jos jokin menee pieleen, palautetaan virheviesti
        catch (err){
            throw new Error(err.message)
        }
    }

    // Artikkelin muokkaaminen
    async ChangeArticle(id, title, content){
        // Yritetään muokata artikkelia
        try{
            // Query tietokantaan
            const modifiedArticle = await supabase.from('articles').update({ title: title, content: content }).eq('id', id)

            // Jos query palauttaa 204 No Content, palautetaan viesti muutos onnistui
            if (modifiedArticle.status === 204) {
                return("Article with id " + id + " modified")
            }
            // Muissa tapauksissa palautetaan virheviesti
            else {
                return("Something went wrong")
            }
        }
        // Jos jokin menee pieleen, palautetaan virheviesti
        catch (err){
            throw new Error(err.message)
        }
    }

    // Poistetaan tietty artikkeli id:n perusteella
    async DeleteArticle(id, user){

        // Query tietokantaan - Autorisointi - Tarkistetaan rooli
        const loggedinuser = await supabase.from('users').select('*').eq('id', user.userId)

        // Jos sisäänkirjautunut käyttäjä ei ole admin, evätään poistopyyntö
        if (loggedinuser.data[0].role != "admin"){
            throw new Error("Unauthorized to delete article")
        }

        // Query tietokantaan - Tarkistetaan löytyykö poistettava id tietokannasta
        const artcileidcheck = await supabase.from('articles').select('*').eq('id', [id])

        // Jos kantahaku on 200 OK ja data array ei ole tyhjä, poistetaan artikkeli
        if (artcileidcheck.status === 200 && artcileidcheck.data.length !== 0) {
            // Query tietokantaan - Artikkelin poisto
            const deletedArticle = await supabase.from('articles').delete('*').eq('id', [id])
            return("Article with id " + [id] + " deleted")
        }
        // Jos kantahaku on 200 OK mutta data array on tyhjä, palautetaan viesti
        else if (artcileidcheck.status === 200 && artcileidcheck.data.length === 0) {
            return("Article not found")
        }
        // Muissa tapauksissa palautetaan virheviesti
        else {
            return("Something went wrong")
        }

        return
    }
}