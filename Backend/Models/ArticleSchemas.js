import {z} from "zod"

export const CreateArticleSchema = z.object({
    Title: z.string(),
    Content: z.string()
})

