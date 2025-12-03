import {z} from "zod"

export const CreateArticleSchema = z.object({
    title: z.string(),
    content: z.string()
})

