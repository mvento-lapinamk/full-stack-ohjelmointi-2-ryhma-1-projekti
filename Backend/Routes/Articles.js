/**
 * @swagger
 * paths:
 *   /articles:
 *     get:
 *       tags: [
 *         Articles
 *        ]
 *       summary: Returns all articles
 *       responses:
 *         200:
 *           description: A successful response
 *           content: 
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     content:
 *                       type: string
 *                     created:
 *                       type: string
 *                       format: date-time
 *                     updated:
 *                       type: string
 *                       format: date-time
 *                     user_id:
 *                       type: integer
 *               
 *     post:
 *       tags: [
 *         Articles
 *        ]
 *       summary: Creates new article
 *       description: "Requires user to be authenticated: User ID who creates the article will be saved to database."
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *       responses:
 *         204:
 *           description: A successful response
 *
 *   /articles/{id}:
 *     get:
 *       tags: [
 *         Articles
 *        ]
 *       summary: Returns article by id
 *       parameters:
 *         - name: id
 *           in: path
 *           description: Article ID
 *           required: true
 *           schema:
 *             type: integer
 *             format: int64
 *       responses:
 *         200:
 *           description: A successful response
 *           content: 
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   content:
 *                     type: string
 *                   created:
 *                     type: string
 *                     format: date-time
 *                   updated:
 *                     type: string
 *                     format: date-time
 *                   user_id:
 *                     type: integer
 * 
 *     patch:
 *       tags: [
 *         Articles
 *        ]
 *       summary: Modifies article by id
 *       parameters:
 *         - name: id
 *           in: path
 *           description: Article ID
 *           required: true
 *           schema:
 *             type: integer
 *             format: int64
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *       responses:
 *         204:
 *           description: A successful response
 * 
 *     delete:
 *       tags: [
 *         Articles
 *        ]
 *       summary: Deletes article by id
 *       parameters:
 *         - name: id
 *           in: path
 *           description: Article ID
 *           required: true
 *           schema:
 *             type: integer
 *             format: int64
 *       responses:
 *         204:
 *           description: A successful response
 */
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
        res.status(500).json({error: "Something went wrong"})
    }
})

// Haetaan tietty artikkeli id:n perusteella
articles.get("/{:id}", async (req, res) => {
    try{
        const article = await articleService.GetArticleById(req.params.id)
        res.send(article)

    } catch (err){
        res.send(500).json({error: "Something went wrong"})
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
            res.status(400).json({error: "Invalid body to create article", detail: err.message})
        }
        else{
            res.status(500).json({error: err.message})

        }

    }
})

// Muokataan artikkelia
articles.patch("/{:id}", requireAuth, async (req, res) => {
    try{
        const modifyArticleRequest = ModifyArticleSchema.parse(req.body)
        const modifiedArticle = await articleService.ChangeArticle(req.params.id, modifyArticleRequest.title, modifyArticleRequest.content)

        res.status(204).json()

    } catch (err){
        if (err.name == "ZodError"){
            res.status(400).json({error: "Invalid request body", detail: err.message})
        }
        res.status(500).json({error: err.message})

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
