import { dbQuery } from "../db/db.js"


class UserService{

    // Kaikki käyttäjät
    async Users(){
        const query = "SELECT * FROM users"
        const users = await dbQuery(query)

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
        const userQuery = "SELECT * FROM users WHERE username = $1"
        const response = await dbQuery(userQuery, params)
        return response.rows
        
    }
    
    async Login(loginReq) {
        
        const user = await this.UserByUsername(loginReq)
        
        if (length(user) == 0){
            throw new Error("User not found")
        }
        
    }

    async CreateUser(userReq){
        console.log(userReq)
        queryParams = [userReq.first_name, userReq.last_name, userReq.username, userReq.password, "user"]
        const insert = "INSERT INTO users (first_name, last_name, username, password, role) VALUES ($1, $2, $3, $4, $5)"
        
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