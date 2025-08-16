import { z } from "zod"

export const authRegisterSchema = z.object({
    email: z.string().email(),
    name: z.string(),
    password: z.string().min(6),
})

export const authLoginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
})
