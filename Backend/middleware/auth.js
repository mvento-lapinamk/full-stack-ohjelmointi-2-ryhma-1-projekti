import jwt from "jsonwebtoken"
import { UserService } from "../Service/UserService.js"

const userService = new UserService()

export async function requireAuth(req, res, next){
    const {token} = req.cookies

    if (!token){
        return res.status(401).json({message: "Not authorized"})
    }

    const userFromToken = jwt.verify(token, process.env.JWT_SECRET)
    console.log(userFromToken.username)
    
    // Tarkistus, että käyttäjä löytyy
    const user = await userService.UserByUsername(userFromToken)
    
    if (user.rowCount == 0){
        return res.status(401).json({message: "Not Found"})
    }
    if (user.rows.at(0).username != userFromToken.username){
        return res.status(401).json({message: "Not authorized"})
    }
    
    req.user = userFromToken


    next()

}

export async function requireAdmin(req, res, next){
    const {token} = req.cookies

    if (!token){
        return res.status(401).json({message: "Not authorized"})
    }

    const userFromToken = jwt.verify(token, process.env.JWT_SECRET)
    console.log(userFromToken.username)
    
    // Tarkistus, että käyttäjä löytyy
    const user = await userService.UserByUsername(userFromToken)
    
    if (user.rowCount == 0){
        return res.status(401).json({message: "Not Found"})
    }
    if (user.rows.at(0).role != "admin"){
        return res.status(401).json({message: "Not authorized"})
    }
    
    req.user = userFromToken


    next()
}

