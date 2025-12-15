import { Form, redirect, useActionData, useNavigate } from "react-router-dom";


export function Register(){

    // Actioniltä saatava error viesti
    const error = useActionData()

    return (
        <div>
            <h3 className="mb-3 text-sm underline"><a href="/">Palaa etusivulle</a></h3>
            <h4 className="text-2xl mx-auto mt-5 px-5 items-center">Rekisteröidy käyttäjäksi</h4>
            <p className="h-3"></p>
            <Form action="/signup" method="post" className="flex flex-col items-center">
                <label htmlFor="signupFName" className="sr-only">Firstname</label>
                <input type="text" name="first_name" placeholder="Etunimi"/>
                <label htmlFor="signupLName" className="sr-only">Lastname</label>
                <input id="signupLName" type="text" name="last_name" placeholder="Sukunimi"/>
                <label htmlFor="signupUName" className="sr-only">Username</label>
                <input id="signupUName" type="text" minLength={8} name="username" placeholder="Käyttäjänimi"/>
                <label htmlFor="signupPsw" className="sr-only">Password</label>
                <input id="signupPsw" type="password" minLength={8} name="password" placeholder="Salasana"/>
                {error ? <p className="error">{error.message}</p> : <p className=""></p>}
                <button type="submit" className="btn mt-3 mb-5 size-fit">Rekisteröidy</button>
                <p className="h-3"></p>
            </Form>

            <p className="h-2"></p>
            <p>Onko sinulla jo tunnukset?</p>
            <p className="h-3"></p>
            <a href="/login">
                <button className="btn">Kirjaudu sisään</button>
            </a>
        </div>
    )
}

// Uuden käyttäjän luonti
export async function RegisterAction({request}){

    const formData = await request.formData();
    const data = Object.fromEntries(formData)
    
    const res = await fetch("http://localhost:3000/users/register", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(data)
    })

    // Palautetaan actionistä error viestit
    if (!res.ok){
        if (res.status == 400){
            return {message: "Käyttäjänimi ja salasana väh. 8 merkkiä"}
        }
        else {
            return {message: "Rekisteröityminen epäonnistui"}
        }
    }

    // Rekisteröitynyt käyttäjä ohjataan kirjautumaan
    return redirect("/login")

}