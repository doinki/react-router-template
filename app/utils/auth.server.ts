import {
  type CookieSerializeOptions,
  createCookieSessionStorage,
  redirect,
  type Session,
  type SessionData,
} from 'react-router';
import { z } from 'zod';

import { prisma } from '~/prisma.server';

export const SESSION_KEY = 'sessionId';
export const SESSION_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30;

export function getSessionExpiredAt(): Date {
  return new Date(Date.now() + SESSION_EXPIRATION_TIME);
}

export const signinFormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const signupFormSchema = z
  .object({
    confirmPassword: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const authSessionStorage = createCookieSessionStorage({
  cookie: {
    httpOnly: true,
    name: 'session',
    path: '/',
    sameSite: 'lax',
    secrets: process.env.SESSION_SECRET.split(','),
    secure: process.env.NODE_ENV === 'production',
  },
});

const originalCommitSession = authSessionStorage.commitSession;
Object.defineProperty(authSessionStorage, 'commitSession', {
  value: async function commitSession(
    session: Session<SessionData, SessionData>,
    options?: CookieSerializeOptions,
  ): Promise<string> {
    if (options?.maxAge) {
      session.set('expires', new Date(Date.now() + options.maxAge * 1000));
    } else if (options?.expires) {
      session.set('expires', options.expires);
    }

    return originalCommitSession(session, {
      ...options,
      expires: session.get('expires'),
    });
  },
});

export async function getAuthSession(request: Request) {
  const authSession = await authSessionStorage.getSession(
    request.headers.get('cookie'),
  );

  return {
    authSession,
    commitSession: (options?: CookieSerializeOptions) =>
      authSessionStorage.commitSession(authSession, options),
    destroySession: () => authSessionStorage.destroySession(authSession),
    sessionId: authSession.get(SESSION_KEY),
    set: (sessionId: string) => authSession.set(SESSION_KEY, sessionId),
  };
}

export async function getUserId(request: Request): Promise<string | null> {
  const { sessionId } = await getAuthSession(request);
  if (!sessionId) {
    return null;
  }

  const session = await prisma.session.findUnique({
    select: { user: { select: { id: true } } },
    where: { expiredAt: { gt: new Date() }, id: sessionId },
  });
  if (!session?.user) {
    return null;
  }

  return session.user.id;
}

export async function requireUserId(
  request: Request,
  {
    redirectTo = `${new URL(request.url).pathname}${new URL(request.url).search}`,
  }: { redirectTo?: string | null } = {},
) {
  if (!(await getUserId(request))) {
    throw redirect(
      ['/login', redirectTo && new URLSearchParams({ redirectTo }).toString()]
        .filter(Boolean)
        .join('?'),
    );
  }
}

export async function requireAnonymous(request: Request): Promise<void> {
  if (await getUserId(request)) {
    throw redirect('/');
  }
}
