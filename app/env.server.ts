import { z } from 'zod';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ProcessEnv extends z.infer<typeof schema> {}
  }
}

const schema = z.object({
  DATABASE_URL: z.string(),
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
