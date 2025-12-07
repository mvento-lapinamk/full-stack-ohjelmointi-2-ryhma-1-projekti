import { Form } from "react-router-dom";


export function CreateArticle(){




    return (
        <>
            <div className="mx-auto w-3/5">
                <Form action="/article/create" method="post" className="flex flex-col">
                    <label htmlFor="">Otsikon teksti</label>
                    <input type="text" name="title" placeholder="Artikkelin otsikko"  className="input"/>
                    <label htmlFor="">Artikkelin sisältö</label>
                    <textarea name="content" className="input"/>
                </Form>
            </div>
        </>
    )
}