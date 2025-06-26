import { z } from 'zod';

const registerUserValidationSchema = z.object({
  body: z.object({
    firstName: z
      .string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be a string',
      })
      .min(2, { message: 'name must be at least 2 character' })
      .max(30, { message: 'name must be less than 30 character' }),

    lastName: z
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
      .regex(/^\+614\d{8}$/, {
        message: 'Phone number must be a valid Australian number (e.g., +61412345678)',
      }),

    password: z
      .string({
        required_error: 'password is required',
      })
      .min(8, 'Password must be at least 8 characters!'),

    gender: z.enum(['male', 'female', 'other'], {
      required_error: 'Gender is required',
    }),

    dateOfBirth: z
      .string({
        required_error: 'Date of birth is required',
      })
  }),
});

const userValidationZodSchema = {
  registerUserValidationSchema,
};

export default userValidationZodSchema;

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
