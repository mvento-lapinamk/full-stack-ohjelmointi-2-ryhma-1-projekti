import {Router} from "express"
import { UserService } from "../Service/UserService.js"
import { ChangePswSchema, CreateUserSchema, LoginUserSchema, ModifyUserSchema } from "../Models/UserSchemas.js"
import { requireAdmin, requireAuth } from "../middleware/auth.js"

const userService = new UserService()
const user = Router()

user.use((req, res, next) => {
    //console.log(req.baseUrl)

    next()
})


// Hae kaikki käyttäjät
user.get("/", async (req, res) => {
    try{
        
        const users = await userService.Users()
        res.send(users)

    } catch (err){
        res.status(404).json({error: "Something went wrong"})
    }

// Sisäänkirjautuminen
}).post("/login", async (req, res) => {
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
        res.status(404).json({error: err.message})
    }

// Uloskirjautuminen
}).post("/logout", requireAuth, async (req, res) => {

    try{
        res.clearCookie("token")
        res.send("User logged out")

    } catch(err){
        res.status(400).json({message: "Logout error"})
    }

// Haetaan tietty käyttäjä id:n perusteella
}).get("/{:id}", async (req, res) => {

    try {
        const user = await userService.UserById(req.params.id)
        res.send(user)

    } catch (err){
        res.send(404).json({error: "Something went wrong"})
    }

// Luodaan uusi käyttäjä
}).post("/register", async (req, res) => {
    try{
        const newUser = CreateUserSchema.parse(req.body)
        const user = await userService.CreateUser(newUser)

        res.send({msg: user})
    } catch (err){
        if (err.name == "ZodError"){
            res.status(400).json({error: "Invalid login request body", detail: err.message})
        }
        res.status(400).json({error: err.message})
    }

// Muutetaan käyttäjän username id:n perusteella (PATCH)
}).patch("/{:id}", requireAuth, async (req, res) => {
    try{
        const modifyUserRequest = ModifyUserSchema.parse(req.body)
        const modifiedUser = await userService.ChangeUserName(req.params.id, modifyUserRequest.username)

        res.send(modifiedUser)

    } catch (err){
        if (err.name == "ZodError"){
            res.status(400).json({error: "Invalid login request body", detail: err.message})
        }
        res.status(400).json({error: err.message})

    }

// Muutetaan käyttäjän username id:n perusteella (PUT)
}).put("/{:id}", requireAuth, async (req, res) => {
    try{
        const modifyUserRequest = ModifyUserSchema.parse(req.body)
        const modifiedUser = await userService.ChangeUserName(req.params.id, modifyUserRequest.username)

        res.send(modifiedUser)

    } catch (err){
        if (err.name == "ZodError"){
            res.status(400).json({error: "Invalid login request body", detail: err.message})
        }
        res.status(400).json({error: err.message})

    }


// // Muutetaan käyttäjän salasana id:n perusteella
}).put("/password/{:id}", requireAuth, async (req, res) => {
    try{
        const modifyPSWReq = ChangePswSchema.parse(req.body)
        const modifiedUser = await userService.ChangePassword(req.params.id, modifyPSWReq.password)

        res.send(modifiedUser)

    } catch (err){
        if (err.name == "ZodError"){
            res.status(400).json({error: "Invalid login request body", detail: err.message})
        }
        res.status(400).json({error: err.message})

    }


// Poistetaan tietty käyttäjä id:n perusteella
}).delete("/{:id}", requireAuth, async (req, res) => {
    try{
        const deletedUser = await userService.DeleteUser(req.params.id, req.user)

        res.send(deletedUser)

    } catch (err){

        res.status(401).json({error: err.message})
    }


})

export default user