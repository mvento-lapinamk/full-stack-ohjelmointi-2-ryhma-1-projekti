// Tuodaan data access layer
import { supabase } from "../db/db.js"

// Kommenttien Service luokka
export class CommentService{

    // Haetaan kaikki kommentit
    async GetComments(){
        // Yritetään hakea kommentit
        try{
            // Query tietokantaan
            const comments = await supabase.from('comments').select('*')

            // Jos kantahaku on 200 OK ja data array ei ole tyhjä, palautetaan kommentit
            if (comments.status === 200 && comments.data.length !== 0) {
                return comments.data
            }
            // Jos kantahaku on 200 OK mutta data array on tyhjä, palautetaan viesti
            else if (comments.status === 200 && comments.data.length === 0) {
                throw new Error("Comments not found")
            }
            // Muissa tapauksissa palautetaan virheviesti
            else {
                throw new Error("Something went wrong")
            }
        } 
        // Jos jokin menee pieleen, palautetaan virheviesti
        catch (err){
            throw new Error(err.message)
        }
    }

    // Haetaan kommentit tietyn artikkelin id:n perusteella
    async GetCommentsByArticleId(id){
        // Yritetään hakea kommentti
        try{
            // Query tietokantaan
            const comments = await supabase.from('comments').select('*').eq('article_id', [id])

            // Jos kantahaku on 200 OK ja data array ei ole tyhjä, palautetaan artikkelin kommentit
            if (comments.status === 200 && comments.data.length !== 0) {
                return comments.data
            }
            // Jos kantahaku on 200 OK mutta data array on tyhjä, palautetaan viesti
            else if (comments.status === 200 && comments.data.length === 0) {
                throw new Error("Comments not found")
            }
            // Muissa tapauksissa palautetaan virheviesti
            else {
                throw new Error("Something went wrong")
            }
        } 
        // Jos jokin menee pieleen, palautetaan virheviesti
        catch (err){
            throw new Error(err.message)
        }
    }

    // Luodaan uusi kommentti
    async CreateComment(createCommentReq, user){
        // Yritetään lisätä uusi kommentti
        try{
            // Query tietokantaan
            const insertedComment = await supabase.from('comments').insert({
                content: createCommentReq.content,
                article_id: createCommentReq.article_id,
                user_id: user.userId
            })

            // Jos query palauttaa 201 Created, palataan
            if (insertedComment.status === 201) {
                return
            }

        } 
        // Jos jokin menee pieleen, palautetaan virheviesti
        catch (err){
            throw new Error(err.message)
        }
    }

    // Poistetaan tietty kommentti id:n perusteella
    async DeleteComment(id, user){
        // Yritetään poistaa kommentti
        try{
            // Query tietokantaan - Autorisointi - Tarkistetaan rooli
            const loggedinuser = await supabase.from('users').select('*').eq('id', user.userId)

            // Jos sisäänkirjautunut käyttäjä ei ole admin, evätään poistopyyntö
            if (loggedinuser.data[0].role != "admin"){
                throw new Error("Unauthorized to delete comment")
            }

            // Query tietokantaan - Tarkistetaan löytyykö poistettava id tietokannasta
            const commentidcheck = await supabase.from('comments').select('*').eq('id', [id])

            // Jos kantahaku on 200 OK ja data array ei ole tyhjä, poistetaan kommentti
            if (commentidcheck.status === 200 && commentidcheck.data.length !== 0) {
                // Query tietokantaan - Kommentin poisto
                const deletedComment = await supabase.from('comments').delete('*').eq('id', [id])
                // Jos query palauttaa 204 No Content, palataan
                if (deletedComment.status === 204) {
                    return
                }
            }
            // Jos kantahaku on 200 OK mutta data array on tyhjä, palautetaan viesti
            else if (commentidcheck.status === 200 && commentidcheck.data.length === 0) {
                throw new Error("Comment not found")
            }
            // Muissa tapauksissa palautetaan virheviesti
            else {
                throw new Error("Something went wrong")
            }
        } 
        // Jos jokin menee pieleen, palautetaan virheviesti
        catch (err){
            throw new Error(err.message)
        }
    }
}