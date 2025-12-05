import { Form, redirect } from "react-router-dom";


export function Login(){


    return (
        <div>
            <h4>Kirjaudu sisään</h4>
            <Form action="/login" method="post">
                <input type="text" name="username" placeholder="Käyttäjänimi"/>
                <input type="password" name="password" placeholder="Salasana"/>
                <button type="submit">Kirjaudu</button>
            </Form>
            

            <p>Eikö tunnusta? Rekisteröidy käyttäjäksi</p>
            <a href="/signup">
                <button>Rekisteröitymään</button>
            </a>
        </div>
    )
}

/**
 * @type {import("react-router-dom").ActionFunction}
 */
export async function LoginAction({request}){
    const formData = await request.formData();
    const {username, password} = Object.fromEntries(formData)
    console.log(username, password)    
    /*
    const res = await fetch("localhost:3000/api/user/login", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(username, password)
    })

    console.log(res.body)*/
}