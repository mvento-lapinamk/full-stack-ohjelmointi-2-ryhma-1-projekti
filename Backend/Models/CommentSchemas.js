
import {z} from "zod"

// .min(*) määrittää minimimerkkimäärän

export const CreateCommentSchema = z.object({
    content: z.string().min(1),
    article_id: z.int().min(1)
})
