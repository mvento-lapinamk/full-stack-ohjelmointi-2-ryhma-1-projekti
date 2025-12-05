import { Form } from "react-router-dom";


export function Register(){


    return (
        <div>
            <h4>Rekisteröidy</h4>
            <Form action="/signup" method="post" className="flex flex-col items-center">
                <input type="text" name="first_name" placeholder="Etunimi"/>
                <input type="text" name="last_name" placeholder="Sukunimi"/>
                <input type="text" name="username" placeholder="Käyttäjä nimi"/>
                <input type="password" name="password" placeholder="Salasana"/>
                <button type="submit">Rekisteröidy</button>
            </Form>
        </div>
    )
}

export async function RegisterAction({request}){
    const formData = await request.formData();
    const {username, password} = Object.fromEntries(formData)
    console.log(username, password)    
    /*
    const res = await fetch("localhost:3000/api/user/register", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(username, password)
    })

    console.log(res.body)*/
}