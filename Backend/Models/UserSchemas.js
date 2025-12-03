
import {z} from "zod"

export const CreateUserSchema = z.object({
    first_name: z.string(),
    last_name: z.string(),
    username: z.string().nonempty(),
    password: z.string().nonempty()
})

export const LoginUserSchema = z.object({
    username: z.string().nonempty(),
    password: z.string().nonempty()
})

export const ModifyUserSchema = z.object({
    username: z.string().nonempty()
})

export const ChangePswSchema = z.object({
    password: z.string().nonempty()
})