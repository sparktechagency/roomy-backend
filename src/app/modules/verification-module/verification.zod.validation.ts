import { z } from 'zod';

export const verificationSchema = z.object({
  body: z.object({
    data: z.object({
      country: z.string(),
      verificationType: z.enum(['passport', 'id', 'driver license']),
      isFaceVerified: z.coerce.boolean(),
    }),
  }),
});

const verificationValidationZodSchema = {
  verificationSchema,
};

export default verificationValidationZodSchema;
