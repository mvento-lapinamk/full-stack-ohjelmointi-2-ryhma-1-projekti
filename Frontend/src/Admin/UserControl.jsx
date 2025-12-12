import { useLoaderData } from "react-router-dom"


export function UserControl(){

    // Loader lataa käyttäjät
    const userData = useLoaderData()

    // Lähinnä käyttäjien listaus. Nappi jolla admin voi poistaa käyttäjän 
    return (
        <div>
            { userData.map((user, key) => {
                return (
                    
                    <div key={key} className="flex items-center ml-5">
                        <section>
                            <p>{user.first_name} {user.last_name}, {user.username}, {user.role}</p>

                        </section>
                        <button className="btn ml-5 my-5">Poista</button>
                    </div>
                )
            })

            }
        </div>
    )

}

// Lataa käyttäjät
export async function UserControlLoader(){

    const res = await fetch("http://localhost:3000/users", {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-type": "application/json"
        }

    })

    if (!res.ok){
        if (res.status == 401){
            throw new Response("Ei oikeuksia päästä sivulle", {status: res.status})
        }
        else {
            throw new Response("Palvelussamme saattaa olla ongelma", {status: res.status})
        }
    }

    const data = await res.json()

    return data
}