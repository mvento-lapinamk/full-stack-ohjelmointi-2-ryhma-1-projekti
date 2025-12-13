import { useRouteError } from "react-router-dom";


export function ErrorPage(){
    const error = useRouteError()

    return (
        
        <div>
            <h1 className="my-5">Jokin meni pieleen</h1>
            {error ? 
                <p>{error.data}</p> : <p>Sivu ei saavutettavissa</p>
            }
                
        </div>
    )
}