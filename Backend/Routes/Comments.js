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
        res.status(500).json({error: err.message})
    }
})

// Haetaan kommentit artikkelin id:n perusteella
comments.get("/{:id}", async (req, res) => {
    try{
        const comments = await commentService.GetCommentsByArticleId(req.params.id)
        res.send(comments)

    } catch (err){
        res.status(500).json({error: err.message})
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
