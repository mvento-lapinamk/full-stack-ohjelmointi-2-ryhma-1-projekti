import { dbQuery } from "../db/db.js"

export class ArticleService{

    async GetArticles(){ // Hae kaikki artikkelit
        const query = "SELECT * FROM articles"
        const articles = await dbQuery(query)

        console.log(articles)

        if (articles.rowCount == 0){
            throw new Error("Articles not found")
        }

        return articles.rows
    }

    async GetArticleById(id){
        const queryParams = [id]
        const query = "SELECT * FROM articles WHERE id = $1"

        const article = await dbQuery(query, queryParams)

        if (article.rowCount == 0){
            throw new Error("Article not found")
        }

        return article.rows
    }

    async CreateArticle(createArticleReq, reqUser){

        // Hae käyttäjän id
        const {userId} = reqUser
        const now = new Date()
        const insertParams = [createArticleReq.title, createArticleReq.content, now, now, userId]
        const query = "INSERT INTO articles (title, content, created, updated, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *"

        try{
            const insertedArticle = await dbQuery(query, insertParams)

        } catch (err){
            throw new Error(err.message)
        }

        return insertedArticle.rows

    }
}