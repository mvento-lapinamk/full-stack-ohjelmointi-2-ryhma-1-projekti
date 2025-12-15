import { useEffect, useState } from "react"
import { Form, redirect, useActionData, useRouteLoaderData } from "react-router-dom"
import { FormatTime } from "../Components/FormatTime"


export function ProfileView(){

    // Käytä headerin hakemaa käyttäjä dataa
    const userData = useRouteLoaderData("root")
    // State käyttäjän laajemmille tiedoille
    const [user, setUser] = useState([])

    // State siistimmälle ajalle
    const [formattedTime, setFormattedTime] = useState()

    const [showPswForm, setShowPswForm] = useState(false)
    const [showUnameForm, setShowUnameForm] = useState(false)
    // Actionista saadaan tunnuksen/salasanan vaihdon vastaus
    const actionResult = useActionData()


    // Hae käyttäjän kaikki tiedot
    async function getUserData(userId){
        const res = await fetch(`http://localhost:3000/users/${userId}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-type": "application/json"
            },
        })

        if (!res.ok){

            throw new Response("Profiilia ei voida hakea")
        }

        return await res.json()
    }

    useEffect(() => {
        getUserData(userData.id).then(data => {
            setUser(data)
            setFormattedTime(FormatTime(data.created))
        })

    }, [])

    return (
        <>
            <div className="w-fit mx-auto">
                <h1 className="text-start my-3">Profiilisi</h1>
                <p className="text-start font-bold">Nimi:</p>
                <p className="text-start pb-3">{user.first_name ? user.first_name : ""} {user.last_name ? user.last_name : ""}</p>
                <p className="text-start font-bold">Käyttäjätunnus:</p>
                <p className="text-start pb-3">{user.username}</p>
                <p className="text-start font-bold">Käyttäjä luotu:</p>
                <p className="text-start">{formattedTime}</p>
                <button className="btn my-5 mr-2" onClick={() => {
                    if (showUnameForm){
                        setShowUnameForm(false)
                    } else {setShowUnameForm(true)}
                    setShowPswForm(false)}}>Vaihda Käyttäjätunnus</button>
                <button className="btn my-5" onClick={() => {
                    if (showPswForm){
                        setShowPswForm(false) 
                    } else {setShowPswForm(true)}

                    setShowUnameForm(false)}}>Vaihda Salasana</button>
            </div>
            <div>
                {showPswForm ? 
                <Form name="pswChange" method="patch" action="/my/profile" className="flex flex-col w-fit items-center mx-auto">
                    <input type="hidden" name="form" value="password"/>
                    <input type="hidden" name="user_id" value={user.id}/>
                    <label htmlFor="newInput" className="sr-only">Uusi salasana</label>
                    <input id="newInput" type="password" name="newInput" placeholder="Anna uusi salasana"/>
                    <label htmlFor="newInputAgain" className="sr-only">Toista uusi salasana</label>
                    <input id="newInputAgain" type="password" name="newInputAgain" placeholder="Toista uusi salasana"/>
                    {actionResult ? <p className="error">{actionResult.error}</p> : <p className="h-6"></p>}
                    <button type="submit" className="btn mb-5 size-fit">Vahvista</button>
                </Form> : <></> }
            </div>
            <div>
                {showUnameForm ? 
                <Form method="patch" action="/my/profile" className="flex flex-col w-fit items-center mx-auto">
                    <input type="hidden" name="form" value="username"/>
                    <input type="hidden" name="user_id" value={user.id}/>
                    <label htmlFor="newInput" className="sr-only">Uusi salasana</label>
                    <input id="newInput" type="text" name="newInput" placeholder="Anna uusi käyttäjätunnus"/>
                    <label htmlFor="newInputAgain" className="sr-only">Toista uusi salasana</label>
                    <input id="newInputAgain" type="text" name="newInputAgain" placeholder="Toista uusi käyttäjätunnus"/>
                    {actionResult ? <p className="error">{actionResult.error}</p> : <p className="h-6"></p>}
                    <button type="submit" className="btn mb-5 size-fit">Vahvista</button>
                </Form> : <></> }
            </div>

        </>
    )
}

// Salasanan ja username vaihto action !! Tämä varmaan tyhmää pistää samaan actioniin
export async function ProfileViewAction({ request }){


    const formData = await request.formData()
    const {form, user_id, newInput, newInputAgain} = Object.fromEntries(formData)

    // Salasana osuus
    if (form === "password"){
        // Palautetaan viesti, jos salasanat ovat erit
        if (newInput !== newInputAgain){
            return {error: "Salasanat eivät täsmää"}
        }
    
        const res = await fetch(`http://localhost:3000/users/password/${user_id}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({password: newInput})
    
        })
    
    
        if (!res.ok){
            console.log(res)
            return {error: "Salasanan vaihto ei onnistunut"}
        }
    
        console.log("Salasana vaihdettu")
        return {error: "Salasanan vaihto onnistui"}

    }
    // Käyttäjätunnus osuus
    if (form === "username"){
        // Palautetaan viesti, jos salasanat ovat erit
        if (newInput !== newInputAgain){
            return {error: "Käyttäjätunnukset eivät täsmää"}
        }
    
        const res = await fetch(`http://localhost:3000/users/username/${user_id}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username: newInput})
    
        })
    
    
        if (!res.ok){
            console.log(res)
            return {error: "Käyttäjätunnuksen vaihto ei onnistunut"}
        }
    
        console.log("Käyttäjätunnus vaihdettu")
        return {error: "Käyttäjätunnuksen vaihto onnistui"}

    }
}
