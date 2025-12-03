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
        res.status(404).json({message: "Not found"})
    }


}).post("/login", async (req, res) => { // Kirjaudu sisään
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


}).post("/logout", requireAuth, async (req, res) => { // Kirjaudu ulos

    try{
        res.clearCookie("token")
        res.send("User logged out")

    } catch(err){
        res.status(400).json({message: "Logout error"})
    }

}).get("/{:id}", async (req, res) => { // Hae käyttäjä id:llä

    try {
        const user = await userService.UserById(req.params.id)
        if (user.rowCount == 0){
            res.status(404).json({error: "User not found"})
        }
    
        res.send(user.rows[0])

    } catch (err){
        res.status(400).json({error: err.message})
    }


}).post("/register", async (req, res) => { // Luo käyttäjä
    try{
        const newUser = CreateUserSchema.parse(req.body)
        console.log(newUser)
    
        const user = await userService.CreateUser(newUser)

        res.send({msg: "Käyttäjä luotu", user: user})
    } catch (err){
        if (err.name == "ZodError"){
            res.status(400).json({error: "Invalid login request body", detail: err.message})
        }
        res.status(400).json({error: err.message})
    }


}).patch("/", requireAuth, async (req, res) => { // Update user
    try {
        const modifyUserRequest = ModifyUserSchema.parse(req.body)
    
        const modifiedUser = await userService.ChangeUserName(modifyUserRequest, req.user)
        res.send(modifiedUser)


    } catch (err){
        if (err.name == "ZodError"){
            res.status(400).json({error: "Invalid login request body", detail: err.message})
        }
        res.status(400).json({error: err.message})

    }


}).put("/", requireAuth, async (req, res) => { // Update user
    try{
        const modifyUserRequest = ModifyUserSchema.parse(req.body)
    
        const modifiedUser = await userService.ChangeUserName(modifyUserRequest, req.user)
        res.send(modifiedUser)


    } catch (err){
        if (err.name == "ZodError"){
            res.status(400).json({error: "Invalid login request body", detail: err.message})
        }
        res.status(400).json({error: err.message})
    }



}).put("/password", requireAuth, async (req, res) => {
    try{
        const modifyPSWReq = ChangePswSchema.parse(req.body)
        await userService.ChangePassword(modifyPSWReq, req.user)

        res.send("Password changed")

    } catch (err){
        res.status(400).json({error: err.message})
    }





}).delete("/{:id}", requireAuth, async (req, res) => { // Poista käyttäjä
    try{
        const deletedUser = await userService.DeleteUser(req.params.id, req.user)

        res.send(deletedUser)

    } catch (err){

        res.status(401).json({error: err.message})
    }


})

export default user