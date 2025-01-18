import { z } from 'zod';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof schema> {}
  }
}

const schema = z.object({
  SESSION_SECRET: z.string(),
});

export function init() {
  const parsed = schema.safeParse(process.env);

  if (!parsed.success) {
    throw new Error(
      JSON.stringify(parsed.error.flatten().fieldErrors, null, 2),
    );
  }
}
