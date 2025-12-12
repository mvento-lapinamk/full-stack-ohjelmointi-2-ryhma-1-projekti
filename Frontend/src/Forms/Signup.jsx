import { Form, redirect, useActionData, useNavigate } from "react-router-dom";


export function Register(){

    // Actioniltä saatava error viesti
    const error = useActionData()

    return (
        <div>
            <h4 className="text-2xl my-5">Rekisteröidy</h4>
            <Form action="/signup" method="post" className="flex flex-col items-center">
                <label htmlFor="signupFName" className="sr-only">Firstname</label>
                <input type="text" name="first_name" placeholder="Etunimi"/>
                <label htmlFor="signupLName" className="sr-only">Lastname</label>
                <input id="signupLName" type="text" name="last_name" placeholder="Sukunimi"/>
                <label htmlFor="signupUName" className="sr-only">Username</label>
                <input id="signupUName" type="text" minLength={8} name="username" placeholder="Käyttäjänimi"/>
                <label htmlFor="signupPsw" className="sr-only">Password</label>
                <input id="signupPsw" type="password" minLength={8} name="password" placeholder="Salasana"/>
                <button type="submit" className="btn">Rekisteröidy</button>
            </Form>
            {error ? <p className="error">{error.message}</p> : <p className="h-6"></p>}
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