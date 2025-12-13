import {Router} from "express"
import { ArticleService } from "../Service/ArticleService.js"
import { requireAuth } from "../middleware/auth.js"
import { CreateArticleSchema, ModifyArticleSchema } from "../Models/ArticleSchemas.js"

const articleService = new ArticleService()

const articles = Router()

articles.use((req, res, next) => {
    next()
})

// Haetaan kaikki artikkelit
articles.get("/", async (req, res) => {
    try{
        const articles = await articleService.GetArticles()
        res.send(articles)

    } catch (err){
        res.status(500).json({error: err.message})
    }
})

// Haetaan tietty artikkeli id:n perusteella
articles.get("/{:id}", async (req, res) => {
    try{
        const article = await articleService.GetArticleById(req.params.id)
        res.send(article)

    } catch (err){
        res.status(500).json({error: err.message})
    }
})

// Luodaan uusi artikkeli
articles.post("/", requireAuth, async (req, res) => {
    try{
        const createArticleReq = CreateArticleSchema.parse(req.body)
        const createdArticle = await articleService.CreateArticle(createArticleReq, req.user)
        
        res.status(204).json()

    } catch (err){
        if (err.name == "ZodError"){
            const zodErrorFlattened = err.flatten()
            const zodErrorStringified = JSON.stringify(zodErrorFlattened.fieldErrors)
            res.status(400).json({error: "Invalid request body", detail: zodErrorStringified})
        }
        else {
            res.status(500).json({error: err.message})
        }
    }
})

// Muokataan artikkelia
articles.patch("/{:id}", requireAuth, async (req, res) => {
    try{
        const modifyArticleRequest = ModifyArticleSchema.parse(req.body)
        const modifiedArticle = await articleService.ChangeArticle(req.params.id, modifyArticleRequest.title, modifyArticleRequest.description, modifyArticleRequest.content)

        res.status(204).json()

    } catch (err){
        if (err.name == "ZodError"){
            const zodErrorFlattened = err.flatten()
            const zodErrorStringified = JSON.stringify(zodErrorFlattened.fieldErrors)
            res.status(400).json({error: "Invalid request body", detail: zodErrorStringified})
        }
        else {
            res.status(500).json({error: err.message})
        }
    }
})

// Poistetaan artikkeli id:n perustella
articles.delete("/{:id}", requireAuth, async (req, res) => {
    try{
        const deletedArticle = await articleService.DeleteArticle(req.params.id, req.user)

        res.status(204).json()

    } catch (err){

        res.status(500).json({error: err.message})
    }
})

export default articles
