import { z } from 'zod';

const registerUserValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be a string',
      })
      .min(2, { message: 'name must be at least 2 character' })
      .max(30, { message: 'name must be less than 30 character' }),

    email: z
      .string({
        required_error: 'email is required',
        invalid_type_error: 'email must be a string',
      })
      .email({ message: 'invalid email adresss' }),

    phone: z
      .string({
        required_error: 'Phone is required',
      })
      .min(11, { message: 'phone must be at least 11 digits' })
      .regex(/^\d+$/, 'Phone number must only contain digits!'),

    password: z
      .string({
        required_error: 'password is required',
      })
      .min(8, 'Password must be at least 8 characters!'),
  }),
});


const userValidationZodSchema = {
    registerUserValidationSchema
}

export default userValidationZodSchema

/*

export const registerUserValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(100),
    email: z
      .string({ invalid_type_error: 'Please add a valid email' })
      .email('Invalid email format')
      .optional(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    phone: z.string().min(1, 'Phone number is required').max(15).optional(),
  }),
});


*/
