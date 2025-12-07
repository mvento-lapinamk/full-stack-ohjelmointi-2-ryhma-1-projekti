

export function CommentCard({user, comment, created}){


    return (
        <div className="flex flex-col my-5">
            <p>{comment}</p>
            <p>Kommentoija {user}</p>
            <p>{created}</p>

        </div>
    )
}