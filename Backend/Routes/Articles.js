
import {Router} from "express"
import { ArticleService } from "../Service/ArticleService.js"
import { requireAuth } from "../middleware/auth.js"
import { CreateArticleSchema } from "../Models/ArticleSchemas.js"

const articleService = new ArticleService()

const articles = Router()

articles.use((req, res, next) => {
    console.log(req.baseUrl)

    next()
})

// Haetaan kaikki artikkelit
articles.get("/", async (req, res) => {
    try{
        
        const articles = await articleService.GetArticles()
        res.send(articles)

    } catch (err){
        res.status(404).json({error: "Something went wrong"})
    }

// Haetaan tietty artikkeli id:n perusteella
}).get("/{:id}", async (req, res) => {
    try{
        const article = await articleService.GetArticleById(req.params.id)
        res.send(article)

    } catch (err){
        res.send(404).json({error: "Something went wrong"})
    }

// Luodaan uusi artikkeli
}).post("/", requireAuth, async (req, res) => {
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


// Muokataan artikkelia
}).put("/{:id}", requireAuth, async (req, res) => {
    res.send("Muokkaa artikkelia")


// Muokataan artikkelia
}).patch("/{:id}", requireAuth, async (req, res) => {
    
    res.send("Muokkaa artikkelia")

// Poistetaan artikkeli id:n perustella
}).delete("/{:id}", requireAuth, async (req, res) => {
    
    res.send({
        id: req.params.id,
        deleted: true
    })
})

export default articles
