/**
 * @swagger
 * /users:
 *   get:
 *     tags: [
 *       Users
 *      ]
 *     summary: Returns all users
 *     responses:
 *       200:
 *         description: A successful response
 *         content: 
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   first_name:
 *                     type: string
 *                   last_name:
 *                     type: string
 *                   username:
 *                     type: string
 *                   password:
 *                     type: string
 *                   created:
 *                     type: string
 *                     format: date-time
 *                   role:
 *                     type: string
 * 
 * /users/login:
 *   post:
 *     tags: [
 *       Users
 *      ]
 *     summary: Login for user authentication
 *     description: "Sets token cookie to client. Minimum length for username and password: 8 characters"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: A successful response
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     username:
 *                       type: string
 *                     password:
 *                       type: string
 *                     created:
 *                       type: string
 *                       format: date-time
 *                     role:
 *                       type: string
 * 
 * /users/logout:
 *   get:
 *     tags: [
 *       Users
 *      ]
 *     summary: Logout for user authentication
 *     description: "Removes token cookie from client"
 *     responses:
 *       204:
 *         description: A successful response
 * 
 * /users/{id}:
 *   get:
 *     tags: [
 *       Users
 *      ]
 *     summary: Returns user by id
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *     responses:
 *       200:
 *         description: A successful response
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 first_name:
 *                   type: string
 *                 last_name:
 *                   type: string
 *                 username:
 *                   type: string
 *                 password:
 *                   type: string
 *                 created:
 *                   type: string
 *                   format: date-time
 *                 role:
 *                   type: string
 * 
 *   delete:
 *     tags: [
 *       Users
 *      ]
 *     summary: Deletes user by id
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *     responses:
 *       204:
 *         description: A successful response
 * 
 * /users/register:
 *   post:
 *     tags: [
 *       Users
 *      ]
 *     summary: Creates new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       204:
 *         description: A successful response
 * 
 * /users/username/{id}:
 *   patch:
 *     tags: [
 *       Users
 *      ]
 *     summary: Changes username by id
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *     responses:
 *       204:
 *         description: A successful response
 * 
 * /users/password/{id}:
 *   patch:
 *     tags: [
 *       Users
 *      ]
 *     summary: Changes password by id
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       204:
 *         description: A successful response
 * 
 */
import {Router} from "express"
import { UserService } from "../Service/UserService.js"
import { ChangePswSchema, CreateUserSchema, LoginUserSchema, ModifyUserSchema } from "../Models/UserSchemas.js"
import { requireAdmin, requireAuth } from "../middleware/auth.js"

const userService = new UserService()
const users = Router()

users.use((req, res, next) => {
    next()
})

// Hae kaikki käyttäjät
users.get("/", async (req, res) => {
    try{
        const users = await userService.Users()
        res.send(users)

    } catch (err){
        res.status(500).json({error: "Something went wrong"})
    }
})

// Sisäänkirjautuminen
users.post("/login", async (req, res) => {
    try 
    {
        const loginReq = LoginUserSchema.parse(req.body)
        const {token, userData} = await userService.Login(loginReq)

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7days
        })

        res.send({message: "Logged in", user: userData})
        
    } catch (err) {
        if (err.name == "ZodError"){
            console.log(err)
            res.status(400).json({error: "Invalid login request body", detail: err.message})
        }
        res.status(500).json({error: err.message})
    }
})

// Uloskirjautuminen
users.get("/logout", requireAuth, async (req, res) => {
    try{
        res.clearCookie("token")
        res.status(204).json()

    } catch(err){
        res.status(500).json({message: "Logout error"})
    }
})

// Haetaan tietty käyttäjä id:n perusteella
users.get("/{:id}", async (req, res) => {
    try {
        const user = await userService.UserById(req.params.id)
        res.send(user)

    } catch (err){
        res.send(500).json({error: "Something went wrong"})
    }
})

// Luodaan uusi käyttäjä
users.post("/register", async (req, res) => {
    try{
        const newUser = CreateUserSchema.parse(req.body)
        const user = await userService.CreateUser(newUser)

        res.status(204).json()
    } catch (err){
        if (err.name == "ZodError"){
            res.status(400).json({error: "Invalid login request body", detail: err.message})
        }
        res.status(500).json({error: err.message})
    }
})

// Muutetaan käyttäjän username id:n perusteella
users.patch("/username/{:id}", requireAuth, async (req, res) => {
    try{
        const modifyUserRequest = ModifyUserSchema.parse(req.body)
        const modifiedUser = await userService.ChangeUserName(req.params.id, modifyUserRequest.username)

        res.status(204).json()

    } catch (err){
        if (err.name == "ZodError"){
            res.status(400).json({error: "Invalid login request body", detail: err.message})
        }
        res.status(500).json({error: err.message})

    }
})

// // Muutetaan käyttäjän salasana id:n perusteella
users.patch("/password/{:id}", requireAuth, async (req, res) => {
    try{
        const modifyPSWReq = ChangePswSchema.parse(req.body)
        const modifiedUser = await userService.ChangePassword(req.params.id, modifyPSWReq.password)

        res.status(204).json()

    } catch (err){
        if (err.name == "ZodError"){
            res.status(400).json({error: "Invalid login request body", detail: err.message})
        }
        res.status(500).json({error: err.message})

    }
})

// Poistetaan tietty käyttäjä id:n perusteella
users.delete("/{:id}", requireAuth, async (req, res) => {
    try{
        const deletedUser = await userService.DeleteUser(req.params.id, req.user)

        res.status(204).json()

    } catch (err){

        res.status(500).json({error: err.message})
    }
})

export default users