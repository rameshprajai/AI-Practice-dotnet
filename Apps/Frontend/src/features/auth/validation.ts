import { z } from 'zod'

export const signupSchema = z
  .object({
    fullName: z.string().trim().min(1, 'Full name is required.'),
    email: z.string().trim().email('Enter a valid email address.'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long.'),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

export const signinSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
})

export type SignupSchema = z.infer<typeof signupSchema>
export type SigninSchema = z.infer<typeof signinSchema>
