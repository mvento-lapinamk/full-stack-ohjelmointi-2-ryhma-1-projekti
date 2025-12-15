import { useLoaderData, useNavigate } from "react-router-dom"
import {FaRegTrashAlt} from "react-icons/fa"
import { LuPenTool } from "react-icons/lu"


export function UserControl(){

    const navigate = useNavigate()

    // Loader lataa käyttäjät
    const userData = useLoaderData()

    // Käyttjän poisto
    async function DeleteUser(user){
        // Kysytään ensin varmennus
        const confirmation = confirm(`Haluatko poistaa käyttäjän ${user.first_name} ${user.last_name}`)
        if (!confirmation) return

        const res = await fetch(`http://localhost:3000/users/${user.id}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (!res.ok){
            return alert("Käyttäjän poisto epäonnistui")
        }

        return navigate("/admin/users", {replace: true})

    }

    async function ModifyUserRole(user, newRole){
        // Jos roolia ei muutettu ja nappia painetaa, ei tehdä mitään
        if (user.role === newRole){
            return
        }

        // Kysytään ensin varmennus
        const confirmation = confirm(`Haluatko muokata käyttäjän ${user.first_name} ${user.last_name} roolia ${user.role} -> ${newRole}`)
        if (!confirmation) return

        const res = await fetch(`http://localhost:3000/users/role/${user.id}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({role: newRole})
        })

        if (!res.ok){
            return alert("Roolin muutos ei onnistunut")
        }

        return navigate("/admin/users", {replace: true})
    }



    // Lähinnä käyttäjien listaus. Nappi jolla admin voi poistaa käyttäjän 
    return (
        <div className="flex w-3/5 flex-col mx-auto flex-1">
            <div className="grid grid-cols-6 gap-2">
                <p className="userControlHeader text-start border-2 p-2 font-bold">Etunimi</p>
                <p className="userControlHeader text-start border-2 p-2 font-bold">Sukunimi</p>
                <p className="userControlHeader text-start border-2 p-2 font-bold">Käyttäjätunnus</p>
                <p className="userControlHeader text-start border-2 p-2 font-bold">Rooli</p>
                <p className="userControlHeader text-start border-2 p-2 font-bold">Muokkaa roolia</p>
                <p className="userControlHeader text-start border-2 p-2 font-bold">Poista käyttäjä</p>
            </div>
            { userData.map((user, key) => {
                return (
                    
                    <div key={user.id} className="grid grid-cols-6 items-center gap-2 my-2">
                        <p className="text-start border-2 border-zinc-300 p-2">{user.first_name}</p>
                        <p className="text-start border-2 border-zinc-300 p-2">{user.last_name}</p>
                        <p className="text-start border-2 border-zinc-300 p-2">{user.username}</p>
                        <select id={`roleOption${user.id}`} className="text-start border-2 border-zinc-300 p-2" defaultValue={user.role}>
                            <option value="admin" className="bg-zinc-500">Admin</option>
                            <option value="writer" className="bg-zinc-500">Writer</option>
                            <option value="user" className="bg-zinc-500">User</option>
                        </select>
                        <button className="btn w-fit m-auto" onClick={() => {ModifyUserRole(user, document.getElementById(`roleOption${user.id}`).value)}}><LuPenTool /></button>
                        <button className="btn w-fit m-auto" onClick={() => {DeleteUser(user)}}><FaRegTrashAlt /></button>
                    </div>
                    )
                })
            }
        </div>
    )

}

// Lataa käyttäjät
export async function UserControlLoader(){

    // Tarkistetaan ensin käyttäjän rooli
    const adminRes = await fetch("http://localhost:3000/users/whoami", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-type": "application/json"
            },
        })
    
    // Virhe tilanteissa palauta viesti takaisin komponentille
    if (!adminRes.ok){
        if (adminRes.status == 401){
            throw new Response("Ei oikeuksia päästä sivulle", {status: adminRes.status})
        }
        else {
            throw new Response("Palvelussamme saattaa olla ongelma", {status: adminRes.status})
        }

    }

    // Tarkistetaan admin
    const adminData = await adminRes.json()
    if (adminData.role !== "admin"){
        throw new Response("Ei oikeuksia päästä sivulle", {status: adminRes.status})
    }

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
