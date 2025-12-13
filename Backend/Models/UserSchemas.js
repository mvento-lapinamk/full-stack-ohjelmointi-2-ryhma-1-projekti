
import {z} from "zod"

// .min(*) määrittää minimimerkkimäärän

export const CreateUserSchema = z.object({
    first_name: z.string(),
    last_name: z.string(),
    username: z.string().min(8),
    password: z.string().min(8)
})

export const LoginUserSchema = z.object({
    username: z.string().min(8),
    password: z.string().min(8)
})

export const ModifyUserSchema = z.object({
    username: z.string().min(8)
})

export const ChangePswSchema = z.object({
    password: z.string().min(8)
})

export const ChangeRoleSchema = z.object({
    role: z.enum(["admin", "writer", "user"], z.string())
})