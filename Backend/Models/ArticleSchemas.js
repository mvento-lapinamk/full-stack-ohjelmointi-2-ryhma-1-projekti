import {z} from "zod"

// .min(*) määrittää minimimerkkimäärän

export const CreateArticleSchema = z.object({
    title: z.string().min(1),
    content: z.string().min(1)
})

