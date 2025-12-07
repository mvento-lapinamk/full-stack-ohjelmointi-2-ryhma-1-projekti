import { Form, redirect, useNavigate } from "react-router-dom";


export function Login(){


    return (
        <div className="mx-auto mt-5 px-5 items-center">
            <h4 className="text-2xl">Kirjaudu sisään</h4>
            <Form action="/login" method="post" className="flex flex-col items-center">
                <input type="text" name="username" placeholder="Käyttäjänimi"/>
                <input type="password" name="password" placeholder="Salasana"/>
                <button type="submit" className="btn mb-5 size-fit">Kirjaudu</button>
            </Form>
            

            <p>Eikö tunnusta? Rekisteröidy käyttäjäksi</p>
            <a href="/signup">
                <button className="btn">Rekisteröitymään</button>
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

    const response = await res.json()

    if (!res.ok){
        console.log("error")
        return
    }

    console.log(response)
    return redirect("/")
}