import {Router} from "express"
import UserService from "../Service/UserService.js"
import { CreateUserSchema, LoginUserSchema } from "../Models/UserSchemas.js"

const userService = new UserService()
const user = Router()

user.use((req, res, next) => {
    console.log(req.baseUrl)

    next()
})


// Hae kaikki käyttäjät
user.get("/", async (req, res) => {

    // Get users from db
    const users = await userService.Users()
    console.log(users)
    res.send(users)


}).get("/login", async (req, res) => { // Kirjaudu sisään
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
        
    } catch (e) {
        if (e.name == "ZodError"){
            console.log(e)
            res.status(400).json({error: "Invalid login request body", detail: e.message})
        }
        res.status(400).json({error: e.message})
    }


}).get("/{:id}", async (req, res) => { // Hae käyttäjä id:llä

    const user = await userService.UserById(req.params.id)
    console.log(user)

    res.send(user[0])


}).post("/register", async (req, res) => { // Luo käyttäjä
    try{
        const newUser = CreateUserSchema.parse(req.body)
        console.log(newUser)
    
        const user = await userService.CreateUser(newUser)

        res.send({msg: "Käyttäjä luotu", user: user})
    } catch (e){
        if (e.name == "ZodError"){
            console.log(e)
            res.status(400).json({error: "Invalid login request body", detail: e.message})
        }
        res.status(400).json({error: e.message})
    }


}).delete("/{:id}", (req, res) => { // Poista käyttäjä
    req.body
    res.send("Delete id", req.params.id)


}).patch("/{:id}", (req, res) => { // Update user
    res.send("Muokkaa id", req.params.id)


}).put("/{:id}", (req, res) => { // Update user

    res.send("Muokkaa id", req.params.id)
})

export default user