
import {configDotenv} from "dotenv" 
import {Pool} from "pg"

configDotenv()
console.log(process.env.PORT)

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})


export const dbQuery = (query, params = []) => pool.query(query, params)

export default pool

