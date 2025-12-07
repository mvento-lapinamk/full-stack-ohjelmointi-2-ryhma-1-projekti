import { Form, useNavigate } from "react-router-dom";


export function Register(){


    return (
        <div>
            <h4>Rekisteröidy</h4>
            <Form action="/signup" method="post" className="flex flex-col items-center">
                <input type="text" name="first_name" placeholder="Etunimi"/>
                <input type="text" name="last_name" placeholder="Sukunimi"/>
                <input type="text" name="username" placeholder="Käyttäjänimi"/>
                <input type="password" name="password" placeholder="Salasana"/>
                <button type="submit" className="btn">Rekisteröidy</button>
            </Form>
        </div>
    )
}

export async function RegisterAction({request}){

    console.log("Register action")

    const formData = await request.formData();
    const data = Object.fromEntries(formData)
    
    const res = await fetch("http://localhost:3000/users/register", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(data => {
        console.log(data)
    })

}