import { dbQuery } from "../db/db.js"
import bcrypt from "bcrypt" 
import jwt from "jsonwebtoken"


export class UserService{

    // Kaikki käyttäjät
    async Users(){
        const query = "SELECT * FROM users"
        const users = await dbQuery(query)

        if (users.rowCount == 0){
            throw new Error("No users found")
        }

        return users.rows
    
    }

    // Käyttäjä id:llä
    async UserById(id){
        const params = [id]
        const query = "SELECT * FROM users WHERE id = $1"
        const response = await dbQuery(query, params)

        return response
    }

    async UserByUsername(loginReq){
        // Get user by username
        const params = [loginReq.username]
        const userQuery = "SELECT * FROM users WHERE username = $1 LIMIT 1" // Limit 1 toistaiseksi, username ei ole vielä uniikki
        const response = await dbQuery(userQuery, params)

        return response
        
    }
    
    async Login(loginReq) {
        
        const user = await this.UserByUsername(loginReq)
        
        if (user.rowCount == 0){
            throw new Error("User not found")
        }

        const {password} = user.rows.at(0)

        const correctPsw = await bcrypt.compare(loginReq.password, password)
        if (!correctPsw){
            throw new Error("Password not correct")
        }
        
        const userData = user.rows.at(0)
        
        const JWT_payload = {
            userId: userData.id,
            username: userData.username,
            role: userData.role
        }

        const token = jwt.sign(JWT_payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN || "7d"})

        return {token, userData}
        
    }

    async CreateUser(createUserReq){

        const userExists = await this.UserByUsername(createUserReq)
        if (userExists.rowCount != 0){
            throw new Error("User already exists")
        }
        // hash password
        const passwordHash = await bcrypt.hash(createUserReq.password, 10)

        const insertParams = [createUserReq.first_name, createUserReq.last_name, createUserReq.username, passwordHash, "user"]

        const insertQuery = "INSERT INTO users (first_name, last_name, username, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, role"
        const newUser = await dbQuery(insertQuery, insertParams)

        return newUser.rows
        
    }

    async ChangeUserName(updateData, reqUser){

        const insertParams = [updateData.username, reqUser.userId]
        const insertQuery = "UPDATE users SET username = $1 WHERE id = $2 RETURNING *"
        const modifiedUser = await dbQuery(insertQuery, insertParams)

        return modifiedUser.rows
    }

    async ChangePassword(updateData, reqUser){

        // hash password
        const passwordHash = await bcrypt.hash(updateData.password, 10)
        const insertParams = [passwordHash, reqUser.userId]

        const insertQuery = "UPDATE users SET password = $1 WHERE id = $2 RETURNING *"
        const modifiedPsw = await dbQuery(insertQuery, insertParams)
        if (modifiedPsw.rowCount == 0){
            throw new Error("Password change failed")
        }
        return
    }

    async DeleteUser(id, reqUser){

        console.log(id, reqUser)
        if (id != reqUser.userId && reqUser.role != "admin"){
            throw new Error("Unauthorized to delete user")
        }
        
        const deleteQuery = "Delete FROM users WHERE id = $1 RETURNING *"
        const deletedUser = await dbQuery(deleteQuery, [id])

        return deletedUser.rows
    }
}

