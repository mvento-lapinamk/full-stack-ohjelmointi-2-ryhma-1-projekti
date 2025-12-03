
import {Router} from "express"
import { ArticleService } from "../Service/ArticleService.js"
import { requireAuth } from "../middleware/auth.js"

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

    } catch (err){
        res.send(404).json({message: "Articles not found"})
    }

}).get("/{:id}", async (req, res) => { // Hae yhden artikkelin tiedot
    try{
        const article = await articleService.GetArticleById(req.params.id)
        res.send(article)

    } catch (err){
        res.send(404).json({message: "Article not found"})
    }
    
}).post("/", requireAuth ,async (req, res) => { // Luo artikkelit
    res.send("Artikkelin luonti")



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
