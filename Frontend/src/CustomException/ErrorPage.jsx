import { useRouteError } from "react-router-dom";


export function ErrorPage(){
    const error = useRouteError()

    return (
        <div>
            <h1 className="my-5">Jokin meni pieleen</h1>
            <p>{error.data}</p>
        </div>
    )
}