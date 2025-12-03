
import {Router} from "express"
import { ArticleService } from "../Service/ArticleService.js"
import { requireAuth } from "../middleware/auth.js"
import z from "zod"
import { CreateArticleSchema } from "../Models/ArticleSchemas.js"

const articleService = new ArticleService()

const articles = Router()

articles.use((req, res, next) => {
    console.log(req.baseUrl)

    next()
})

// Hae kaikki artikkelit
articles.get("/", async (req, res) => { // Hae kaikki artikkelit
    try{
        
        const articles = await articleService.GetArticles()
        res.send(articles)
        console.log("Artikkelit")

    } catch (err){
        res.status(404).json({error: "Articles not found"})
    }

}).get("/{:id}", async (req, res) => { // Hae yhden artikkelin tiedot
    try{
        const article = await articleService.GetArticleById(req.params.id)
        res.send(article)

    } catch (err){
        res.send(404).json({error: "Article not found"})
    }
    
}).post("/", requireAuth, async (req, res) => { // Luo artikkelit
    try{
        const createArticleReq = CreateArticleSchema.parse(req.body)
        const createdArticle = await articleService.CreateArticle(createArticleReq, req.user)
        
        res.send(createdArticle)

    } catch (err){
        if (err.name == "ZodError"){
            res.status(400).json({error: "Invalid body to create article", detail: err.message})
        }
        else{
            res.status(500).json({error: err.message})

        }

    }



}).put("/{:id}", requireAuth, async (req, res) => { // Artikkelin muokkaus
    res.send("Muokkaa artikkelia")



}).patch("/{:id}", requireAuth, async (req, res) => { // Artikkelin muokkaus
    
    res.send("Muokkaa artikkelia")


}).delete("/{:id}", requireAuth, async (req, res) => {
    
    res.send({
        id: req.params.id,
        deleted: true
    })
})

export default articles
