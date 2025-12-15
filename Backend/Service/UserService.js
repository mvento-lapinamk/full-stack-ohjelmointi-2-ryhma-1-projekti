import { supabase } from "../db/db.js"
import bcrypt from "bcrypt" 
import jwt from "jsonwebtoken"

// Käyttäjien Service luokka
export class UserService{

    // Haetaan kaikki käyttäjät
    async Users(){
        // Yritetään hakea käyttäjät
        try{
            // Query tietokantaan
            const users = await supabase.from('users').select('*')

            // Jos kantahaku on 200 OK ja data array ei ole tyhjä, palautetaan käyttäjät
            if (users.status === 200 && users.data.length !== 0) {
                return users.data
            }
            // Jos kantahaku on 200 OK mutta data array on tyhjä, palautetaan viesti
            else if (users.status === 200 && users.data.length === 0) {
                throw new Error("Users not found")
            }
            // Muissa tapauksissa palautetaan virheviesti
            else {
                throw new Error("Something went wrong")
            }
        } 
        // Jos jokin menee pieleen, palautetaan virheviesti
        catch (err){
            throw new Error(err.message)
        }
    }

    // Haetaan tietty käyttäjä id:n perusteella
    async UserById(id){
        // Yritetään hakea käyttäjä
        try{
            // Query tietokantaan
            const user = await supabase.from('users').select('*').eq('id', [id])

            // Jos kantahaku on 200 OK ja data array ei ole tyhjä, palautetaan käyttäjä
            if (user.status === 200 && user.data.length !== 0) {
                return user.data[0]
            }
            // Jos kantahaku on 200 OK mutta data array on tyhjä, palautetaan viesti
            else if (user.status === 200 && user.data.length === 0) {
                throw new Error("User not found")
            }
            // Muissa tapauksissa palautetaan virheviesti
            else {
                throw new Error("Something went wrong")
            }
        } 
        // Jos jokin menee pieleen, palautetaan virheviesti
        catch (err){
            throw new Error(err.message)
        }
    }

    // Haetaan tietty käyttäjä usernamen perusteella
    async UserByUsername(loginReq){
        // Yritetään hakea käyttäjä
        try{
            // Query tietokantaan
            const user = await supabase.from('users').select('*').eq('username', [loginReq.username])

            // Jos kantahaku on 200 OK ja data array ei ole tyhjä, palautetaan käyttäjä
            if (user.status === 200 && user.data.length !== 0) {
                return user.data
            }
            // Jos kantahaku on 200 OK mutta data array on tyhjä, palautetaan viesti
            else if (user.status === 200 && user.data.length === 0) {
                throw new Error("User not found")
            }
            // Muissa tapauksissa palautetaan virheviesti
            else {
                throw new Error("Something went wrong")
            }
        } 
        // Jos jokin menee pieleen, palautetaan virheviesti
        catch (err){
            throw new Error(err.message)
        }
    }
    
    // Sisäänkirjautuminen
    async Login(loginReq) {
        // Yritetään kirjautua sisään
        try{
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
            const token = jwt.sign(JWT_payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN})

            // Palautetaan token evästeenä
            return {token, userData}
        } 
        // Jos jokin menee pieleen, palautetaan virheviesti
        catch (err){
            throw new Error(err.message)
        }
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
                throw new Error("User already exists")
            }
            // Jos query palauttaa 201 Created, palataan
            else if (insertedUser.status === 201) {
                return
            }
            // Muissa tapauksissa palautetaan virheviesti
            else {
                throw new Error("Something went wrong")
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
                throw new Error("Username already exists")
            }
            // Jos query palauttaa 204 No Content, palataan
            else if (modifiedUser.status === 204) {
                return
            }
            // Muissa tapauksissa palautetaan virheviesti
            else {
                throw new Error("Something went wrong")
            }
        }
        // Jos jokin menee pieleen, palautetaan virheviesti
        catch (err){
            throw new Error(err.message)
        }
    }

    // Käyttäjän salasanan muuttaminen
    async ChangePassword(id, password){
        // Yritetään muuttaa salasana
        try{
            // Query tietokantaan - Tarkistetaan löytyykö päivitettävä id tietokannasta
            const useridcheck = await supabase.from('users').select('*').eq('id', id)

            // Jos kantahaku on 200 OK ja data array ei ole tyhjä, muutetaan salasana
            if (useridcheck.status === 200 && useridcheck.data.length !== 0) {
                // hash password
                const passwordHash = await bcrypt.hash(password, 10)
                //const insertParams = [passwordHash, reqUser.userId]

                // Query tietokantaan
                const modifiedUser = await supabase.from('users').update({ password: passwordHash }).eq('id', id)

                // Jos query palauttaa 204 No Content, palataan
                if (modifiedUser.status === 204) {
                    return
                }
            }
            // Jos kantahaku on 200 OK mutta data array on tyhjä, palautetaan viesti
            else if (useridcheck.status === 200 && useridcheck.data.length === 0) {
                throw new Error("User not found")
            }
            // Muissa tapauksissa palautetaan virheviesti
            else {
                throw new Error("Something went wrong")
            }
        }
        // Jos jokin menee pieleen, palautetaan virheviesti
        catch (err){
            throw new Error(err.message)
        }
    }

    // Käyttäjän roolin muuttaminen
    async ChangeRole(id, role){
        // Yritetään muuttaa rooli
        try{
            // Query tietokantaan - Tarkistetaan löytyykö päivitettävä id tietokannasta
            const useridcheck = await supabase.from('users').select('*').eq('id', id)

            // Jos kantahaku on 200 OK ja data array ei ole tyhjä, muutetaan rooli
            if (useridcheck.status === 200 && useridcheck.data.length !== 0) {

                // Query tietokantaan
                const modifiedUser = await supabase.from('users').update({ role: role }).eq('id', id)

                // Jos query palauttaa 204 No Content, palataan
                if (modifiedUser.status === 204) {
                    return
                }
            }
            // Jos kantahaku on 200 OK mutta data array on tyhjä, palautetaan viesti
            else if (useridcheck.status === 200 && useridcheck.data.length === 0) {
                throw new Error("User not found")
            }
            // Muissa tapauksissa palautetaan virheviesti
            else {
                throw new Error("Something went wrong")
            }
        }
        // Jos jokin menee pieleen, palautetaan virheviesti
        catch (err){
            throw new Error(err.message)
        }
    }

    // Poistetaan tietty käyttäjä id:n perusteella
    async DeleteUser(id, user){
        // Yritetään poistaa käyttäjä
        try{
            // Query tietokantaan - Tarkistetaan löytyykö poistettava id tietokannasta
            const useridcheck = await supabase.from('users').select('*').eq('id', [id])

            // Jos kantahaku on 200 OK ja data array ei ole tyhjä, poistetaan käyttäjä
            if (useridcheck.status === 200 && useridcheck.data.length !== 0) {
                // Query tietokantaan - Käyttäjän poisto
                const deletedUser = await supabase.from('users').delete('*').eq('id', [id])
                // Jos query palauttaa 204 No Content, palataan
                if (deletedUser.status === 204) {
                    return
                }
            }
            // Jos kantahaku on 200 OK mutta data array on tyhjä, palautetaan viesti
            else if (useridcheck.status === 200 && useridcheck.data.length === 0) {
                throw new Error("User not found")
            }
            // Muissa tapauksissa palautetaan virheviesti
            else {
                throw new Error("Something went wrong")
            }
        }
        // Jos jokin menee pieleen, palautetaan virheviesti
        catch (err){
            throw new Error(err.message)
        }
    }
}

