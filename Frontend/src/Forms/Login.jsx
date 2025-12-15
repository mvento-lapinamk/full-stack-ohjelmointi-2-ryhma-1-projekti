import { Form, redirect, useActionData, useNavigate } from "react-router-dom";


export function Login(){

    // Actionista saatavat error viestit
    const error = useActionData()


    return (
        <div className="mx-auto mt-5 px-5 items-center">
            <h3 className="mb-3 text-sm underline"><a href="/">Palaa etusivulle</a></h3>
            <h4 className="text-2xl">Kirjaudu sisään</h4>
            <p className="h-3"></p>
            <Form action="/login" method="post" className="flex flex-col items-center">
                <label htmlFor="loginUsername" className="sr-only">Username</label>
                <input id="loginUsername" type="text" name="username" placeholder="Käyttäjänimi"/>
                <label htmlFor="loginPassword" className="sr-only">Password</label>
                <input id="loginPassword" type="password" name="password" placeholder="Salasana"/>
                {error ? <p className="error">{error.error}</p> : <p className=""></p>}
                <button type="submit" className="btn mt-3 mb-5 size-fit">Kirjaudu</button>
                <p className="h-3"></p>
            </Form>
            

            <p className="h-2"></p>
            <p>Uusi käyttäjä? Rekisteröidy palveluun:</p>
            <p className="h-3"></p>
            <a href="/signup">
                <button className="btn">Luo tunnus</button>
            </a>
        </div>
    )
}

/**
 * @type {import("react-router-dom").ActionFunction}
 */
export async function LoginAction({request}){


    const formData = await request.formData();
    const data = Object.fromEntries(formData)

    
    const res = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(data)

    })

    if (!res.ok){
        return {error: "Kirjautuminen epäonnistui"}
    }
    
    // Kirjatutunut käyttäjä ohjataan etusivulle
    return redirect("/")
}