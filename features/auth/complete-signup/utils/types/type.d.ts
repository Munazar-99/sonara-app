import { z } from 'zod';
import { completeSignupSchema } from '../zod/schema';

export type CompleteSignupFormValues = z.infer<typeof completeSignupSchema>;
