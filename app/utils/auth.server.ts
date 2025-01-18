/* eslint-disable no-nested-ternary */

import {
  type CookieSerializeOptions,
  createCookieSessionStorage,
  type Session,
  type SessionData,
} from 'react-router';

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
