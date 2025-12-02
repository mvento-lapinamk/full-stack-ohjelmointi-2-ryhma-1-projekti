import { dbQuery } from "../db/db.js"
import bcrypt from "bcrypt" 


class UserService{

    // Kaikki käyttäjät
    async Users(){
        const query = "SELECT * FROM users"
        const users = await dbQuery(query)

        if (users.rowCount == 0){
            throw new Error()
        }

        return users.rows
    
    }

    // Käyttäjä id:llä
    async UserById(id){
        const params = [id]
        const query = "SELECT * FROM users WHERE id = $1"
        const response = await dbQuery(query, params)
        return response.rows
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

        console.log(newUser.rows)

        return newUser.rows
        
    }

    async ModifyUser(id, userReq){
        queryParams = []
        const user = await this.UserById(id)
    }

    async DeleteUser(id){
        const deleteUser = "Delete * FROM users WHERE id = $1"
        await dbQuery(deleteUser, id)
    }
}



export default UserService