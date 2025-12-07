
// Yksittäinen etusivulla näytettävä artikkeli
export function ArticleCard({title, content, created, user}){

    // Content voisi olla tässä tapauksessa lyhyt selitys, ei koko sisältö
    return(
        <div>
            <h2>{title}</h2>
            <p>{content}</p>
            <p>{user} {created}</p>
        </div>
    )
}