import { dbQuery } from "../db/db.js"

export class ArticleService{

    async GetArticles(){ // Hae kaikki artikkelit
        const query = "SELECT * FROM articles"
        const articles = await dbQuery(query)

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
}