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
        // Tehdään käyttäjistä array jossa salasana hash jätetty pois
        const modifiedUsersArray= users.map(user => {
            return {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                username: user.username,
                created: user.created,
                role: user.role
            }})
        res.send(modifiedUsersArray)

    } catch (err){
        res.status(500).json({error: err.message})
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

        res.send({message: "Logged in", id: userData.id})
        
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
        res.status(500).json({error: err.message})
    }
})

// Haetaan tietty käyttäjä id:n perusteella
users.get("/{:id}", async (req, res) => {
    try {
        const user = await userService.UserById(req.params.id)
        // Tehdään käyttäjästä object jossa salasana hash jätetty pois
        res.send({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            created: user.created,
            role: user.role
        })
        res.send(modifiedUserArray)

    } catch (err){
        rres.status(500).json({error: err.message})
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
users.delete("/{:id}", requireAdmin, async (req, res) => {
    try{
        const deletedUser = await userService.DeleteUser(req.params.id, req.user)

        res.status(204).json()

    } catch (err){

        res.status(500).json({error: err.message})
    }
})

export default users