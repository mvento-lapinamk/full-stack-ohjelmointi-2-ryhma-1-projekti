/**
 * @swagger
 * paths:
 *   /comments:
 *     get:
 *       tags: [
 *         Comments
 *        ]
 *       summary: Returns all comments
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
 *                     created:
 *                       type: string
 *                       format: date-time
 *                     content:
 *                       type: string
 *                     article_id:
 *                       type: string
 *                     user_id:
 *                       type: integer
 * 
 *     post:
 *       tags: [
 *         Comments
 *        ]
 *       summary: Creates new comment
 *       description: "Requires user to be authenticated: User ID who creates the comment will be saved to database."
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 content:
 *                   type: string
 *                 article_id:
 *                   type: integer
 *       responses:
 *         204:
 *           description: A successful response
 * 
 *   /comments/{article_id}:
 *     get:
 *       tags: [
 *         Comments
 *        ]
 *       summary: Returns comments by article id
 *       parameters:
 *         - name: article_id
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
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     created:
 *                       type: string
 *                       format: date-time
 *                     content:
 *                       type: string
 *                     article_id:
 *                       type: string
 *                     user_id:
 *                       type: integer
 * 
 *   /comments/{id}:
 *     delete:
 *       tags: [
 *         Comments
 *        ]
 *       summary: Deletes comment by id
 *       parameters:
 *         - name: id
 *           in: path
 *           description: Comment ID
 *           required: true
 *           schema:
 *             type: integer
 *             format: int64
 *       responses:
 *         204:
 *           description: A successful response
 *  */
import {Router} from "express"
import { CommentService } from "../Service/CommentService.js"
import { requireAuth } from "../middleware/auth.js"
import { CreateCommentSchema } from "../Models/CommentSchemas.js"

const commentService = new CommentService()

const comments = Router()

comments.use((req, res, next) => {
    next()
})

// Haetaan kaikki kommentit
comments.get("/", async (req, res) => {
    try{
        const comments = await commentService.GetComments()
        res.send(comments)

    } catch (err){
        res.status(500).json({error: "Something went wrong"})
    }
})

// Haetaan kommentit artikkelin id:n perusteella
comments.get("/{:id}", async (req, res) => {
    try{
        const comments = await commentService.GetCommentsByArticleId(req.params.id)
        res.send(comments)

    } catch (err){
        res.send(500).json({error: "Something went wrong"})
    }
})

// Luodaan uusi kommentti
comments.post("/", requireAuth, async (req, res) => {
    try{
        const createCommentReq = CreateCommentSchema.parse(req.body)
        const createdComment = await commentService.CreateComment(createCommentReq, req.user)
        
        res.status(204).json()

    } catch (err){
        if (err.name == "ZodError"){
            res.status(400).json({error: "Invalid body to create comment", detail: err.message})
        }
        else{
            res.status(500).json({error: err.message})

        }

    }
})

// Poistetaan kommentti id:n perustella
comments.delete("/{:id}", requireAuth, async (req, res) => {
    try{
        const deletedComment = await commentService.DeleteComment(req.params.id, req.user)

        res.status(204).json()

    } catch (err){

        res.status(500).json({error: err.message})
    }
})

export default comments
