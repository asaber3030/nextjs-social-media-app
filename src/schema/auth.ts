import * as zod from 'zod'

export const LoginValidator = zod.object({
  username: zod.string().min(1, { message: "Username is required!" }),
  password: zod.string().min(1, { message: "Password is required!" }),
  client: zod.string(),
  browser: zod.string()
})

export const RegisterValidator = zod.object({
  name: zod.string().min(1, { message: "Name is required!" }),
  username: zod.string().min(1, { message: "Username is required!" }),
  email: zod.string().email({ message: "Please provide a valid e-mail" }),
  password: zod.string().min(1, { message: "Password is required!" }),
  client: zod.string(),
  browser: zod.string()
})

export const EditProfileValidator = zod.object({
  name: zod.string().min(1, { message: 'Name is required' }).max(255, { message: 'Name cannot be more that 255 characters' }),
  username: zod.string().min(1, { message: 'Username is required' }).max(255, { message: 'Username cannot be more that 255 characters' }),
  email: zod.string().email({ message: 'Please provide a valid E-mail address' }),
  bio: zod.string().min(1, { message: 'Bio is required' }).max(255, { message: 'Bio cannot be more that 255 characters' }),
  website: zod.string().url().optional(),
  gender: zod.enum(['Male', 'Female']),
})

export const EditPasswordValidator = zod.object({
  password: zod.string().min(1, { message: 'Password is required' }),
  newPassword: zod.string().min(8, { message: 'Please provide a strong password' }).max(255, { message: 'Password cannot be more 255 characters' }),
})

export const CreatePostValidator = zod.object({
  content: zod.string().min(1, { message: 'Type anything!' }),
})

export const CreateCollectionValidator = zod.object({
  title: zod.string().min(3, "Collection title must be 3 characters minimum").max(25, { message: "Cannot be more than 25 characters" })
})
export const UpdateCollectionValidator = zod.object({
  title: zod.string().min(3, "Collection title must be 3 characters minimum").max(25, { message: "Cannot be more than 25 characters" }),
  order: zod.number(),
})