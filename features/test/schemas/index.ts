import { z } from 'zod';

// Schema for Test feature
export const testSchema = z.object({
  id: z.string(),
  // Add your schema definitions here
});

export type TestSchemaType = z.infer<typeof testSchema>;
