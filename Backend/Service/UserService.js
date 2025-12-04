import { supabase } from "../db/db.js"
import bcrypt from "bcrypt" 
import jwt from "jsonwebtoken"

// Käyttäjien Service luokka
export class UserService{

    // Haetaan kaikki käyttäjät
    async Users(){
        // Query tietokantaan
        const users = await supabase.from('users').select('*')

        // Jos kantahaku on 200 OK ja data array ei ole tyhjä, palautetaan käyttäjät
        if (users.status === 200 && users.data.length !== 0) {
            return users.data
        }
        // Jos kantahaku on 200 OK mutta data array on tyhjä, palautetaan viesti
        else if (users.status === 200 && users.data.length === 0) {
            return("Users not found")
        }
        // Muissa tapauksissa palautetaan virheviesti
        else {
            return("Something went wrong")
        }
    
    }

    // Haetaan tietty käyttäjä id:n perusteella
    async UserById(id){
        // Query tietokantaan
        const user = await supabase.from('users').select('*').eq('id', [id])

        // Jos kantahaku on 200 OK ja data array ei ole tyhjä, palautetaan käyttäjä
        if (user.status === 200 && user.data.length !== 0) {
            return user.data
        }
        // Jos kantahaku on 200 OK mutta data array on tyhjä, palautetaan viesti
        else if (user.status === 200 && user.data.length === 0) {
            return("User not found")
        }
        // Muissa tapauksissa palautetaan virheviesti
        else {
            return("Something went wrong")
        }
    }

    // Haetaan tietty käyttäjä usernamen perusteella
    async UserByUsername(loginReq){
        // Query tietokantaan
        const user = await supabase.from('users').select('*').eq('username', [loginReq.username])

        // Jos kantahaku on 200 OK ja data array ei ole tyhjä, palautetaan käyttäjä
        if (user.status === 200 && user.data.length !== 0) {
            return user.data
        }
        // Jos kantahaku on 200 OK mutta data array on tyhjä, palautetaan viesti
        else if (user.status === 200 && user.data.length === 0) {
            return("User not found")
        }
        // Muissa tapauksissa palautetaan virheviesti
        else {
            return("Something went wrong")
        }
        
    }
    
    // Sisäänkirjautuminen
    async Login(loginReq) {
        
        // Tarkistetaan löytyykö usernamea kannasta
        const user = await this.UserByUsername(loginReq)

        // Jos usernamea ei löydy, palautetaan virheviesti
        if (user === "User not found" || user === "Something went wrong"){
            throw new Error(user)
        }

        // Jos username löytyi, tallennetaan usernamen salasana hash kannasta muuttujaan
        const password = user[0].password

        // Tarkistetaan täsmääkö pyynnössä annettu salasana kannan hashiin
        const correctPsw = await bcrypt.compare(loginReq.password, password)
        if (!correctPsw){
            // Jos salasana ei täsmää, palautetaan virheviesti
            throw new Error("Password not correct")
        }
        
        // Tallennetaan user array muuttujaan
        const userData = user[0]
        
        // Luodaan JSON Web Token payload user datasta
        const JWT_payload = {
            userId: userData.id,
            username: userData.username,
            role: userData.role
        }

        // Generoidaan uusi JSON Web Token
        const token = jwt.sign(JWT_payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN || "7d"})

        // Palautetaan token evästeenä
        return {token, userData}
        
    }

    // Luodaan uusi käyttäjä
    async CreateUser(createUserReq){
        // Yritetään lisätä uusi käyttäjä
        try{
            // hash password
            const passwordHash = await bcrypt.hash(createUserReq.password, 10)
            
            // Query tietokantaan
            const insertedUser = await supabase.from('users').insert({
                first_name: createUserReq.first_name,
                last_name: createUserReq.last_name,
                username: createUserReq.username,
                password: passwordHash,
                role: 'user'
            })

            // Username on tietokannassa uniikki
            // Jos queryssa tapahtuu konflikti, palautetaan viesti että username on varattu
            if (insertedUser.status === 409 && insertedUser.error.code === '23505') {
                return("User already exists")
            }
            // Jos query palauttaa 201 Created, palautetaan viesti lisäys onnistui
            else if (insertedUser.status === 201) {
                return("User created")
            }
            // Muissa tapauksissa palautetaan virheviesti
            else {
                return("Something went wrong")
            }
        }
        // Jos jokin menee pieleen, palautetaan virheviesti
        catch (err){
            throw new Error(err.message)
        }
    }

    // Käyttäjän usernamen muuttaminen
    async ChangeUserName(id, username){
        // Yritetään muokata käyttäjän usernamea
        try{
            // Query tietokantaan
            const modifiedUser = await supabase.from('users').update({ username: username }).eq('id', id)

            // Username on tietokannassa uniikki
            // Jos queryssa tapahtuu konflikti, palautetaan viesti että username on varattu
            if (modifiedUser.status === 409 && modifiedUser.error.code === '23505') {
                return("Username already exists")
            }
            // Jos query palauttaa 204 No Content, palautetaan viesti muutos onnistui
            else if (modifiedUser.status === 204) {
                return("User with id " + id + " username changed to " + username)
            }
            // Muissa tapauksissa palautetaan virheviesti
            else {
                return("Something went wrong")
            }
        }
        // Jos jokin menee pieleen, palautetaan virheviesti
        catch (err){
            throw new Error(err.message)
        }
    }

    // Käyttäjän salasanan muuttaminen
    async ChangePassword(id, password){

        // Query tietokantaan - Tarkistetaan löytyykö päivitettävä id tietokannasta
        const useridcheck = await supabase.from('users').select('*').eq('id', id)

        // Jos kantahaku on 200 OK ja data array ei ole tyhjä, muutetaan salasana
        if (useridcheck.status === 200 && useridcheck.data.length !== 0) {
            // hash password
            const passwordHash = await bcrypt.hash(password, 10)
            //const insertParams = [passwordHash, reqUser.userId]

            // Query tietokantaan
            const modifiedUser = await supabase.from('users').update({ password: passwordHash }).eq('id', id)

            // Jos query palauttaa 204 No Content, palautetaan viesti muutos onnistui
            if (modifiedUser.status === 204) {
                return("User with id " + id + " password changed")
            }
        }
        // Jos kantahaku on 200 OK mutta data array on tyhjä, palautetaan viesti
        else if (useridcheck.status === 200 && useridcheck.data.length === 0) {
            return("User not found")
        }
        // Muissa tapauksissa palautetaan virheviesti
        else {
            return("Something went wrong")
        }
    }

    // Poistetaan tietty käyttäjä id:n perusteella
    async DeleteUser(id, user){

        // Query tietokantaan - Autorisointi - Tarkistetaan rooli
        const loggedinuser = await supabase.from('users').select('*').eq('id', user.userId)

        // Jos sisäänkirjautunut käyttäjä ei ole admin, evätään poistopyyntö
        if (loggedinuser.data[0].role != "admin"){
            throw new Error("Unauthorized to delete user")
        }

        // Query tietokantaan - Tarkistetaan löytyykö poistettava id tietokannasta
        const useridcheck = await supabase.from('users').select('*').eq('id', [id])

        // Jos kantahaku on 200 OK ja data array ei ole tyhjä, poistetaan käyttäjä
        if (useridcheck.status === 200 && useridcheck.data.length !== 0) {
            // Query tietokantaan - Käyttäjän poisto
            const deletedUser = await supabase.from('users').delete('*').eq('id', [id])
            return("User with id " + [id] + " deleted")
        }
        // Jos kantahaku on 200 OK mutta data array on tyhjä, palautetaan viesti
        else if (useridcheck.status === 200 && useridcheck.data.length === 0) {
            return("User not found")
        }
        // Muissa tapauksissa palautetaan virheviesti
        else {
            return("Something went wrong")
        }

        return
    }
}

