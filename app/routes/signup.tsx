import * as bcrypt from 'bcrypt';
import { useId } from 'react';
import { data, redirect, useFetcher } from 'react-router';
import { z } from 'zod';

import { prisma } from '~/prisma.server';
import {
  getAuthSession,
  getSessionExpiredAt,
  requireAnonymous,
  signupFormSchema,
} from '~/utils/auth.server';

import { type Route } from './+types/signup';

export async function loader({ request }: Route.LoaderArgs) {
  await requireAnonymous(request);

  return {};
}

export async function action({ request }: Route.ActionArgs) {
  await requireAnonymous(request);

  const {
    data: fieldValues,
    error,
    success,
  } = await signupFormSchema
    .superRefine(async ({ email }, c) => {
      if (
        await prisma.user.findUnique({
          select: { id: true },
          where: { email },
        })
      ) {
        c.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Email already exists',
          path: ['email'],
        });
      }
    })
    .safeParseAsync(Object.fromEntries(await request.formData()));
  if (!success) {
    return data({ errors: error.flatten().fieldErrors }, { status: 400 });
  }

  const session = await prisma.session.create({
    data: {
      expiredAt: getSessionExpiredAt(),
      user: {
        create: {
          email: fieldValues.email.toLowerCase(),
          password: {
            create: {
              hash: bcrypt.hashSync(fieldValues.password, 10),
            },
          },
        },
      },
    },
    select: {
      expiredAt: true,
      id: true,
    },
  });

  const { commitSession, set } = await getAuthSession(request);
  set(session.id);

  return redirect('/', {
    headers: {
      'Set-Cookie': await commitSession({
        expires: session.expiredAt,
      }),
    },
  });
}

export default function Signup() {
  const fetcher = useFetcher();
  const isPending = fetcher.state !== 'idle';

  const emailId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();

  return (
    <main className="grid flex-1 place-content-center">
      <fetcher.Form className="border p-10" method="post">
        <fieldset className="flex flex-col gap-6" disabled={isPending}>
          <div className="flex flex-col items-start">
            <label htmlFor={emailId}>이메일</label>
            <input
              autoComplete="email"
              className="border px-2 py-1"
              id={emailId}
              name="email"
              type="email"
              required
            />
            {fetcher.data?.errors?.email && (
              <p className="pl-2 text-red-600">{fetcher.data.errors.email}</p>
            )}
          </div>
          <div className="flex flex-col items-start">
            <label htmlFor={passwordId}>비밀번호</label>
            <input
              autoComplete="new-password"
              className="border px-2 py-1"
              id={passwordId}
              minLength={6}
              name="password"
              type="password"
              required
            />
            {fetcher.data?.errors?.password && (
              <p className="pl-2 text-red-600">{fetcher.data.errors.password}</p>
            )}
          </div>
          <div className="flex flex-col items-start">
            <label htmlFor={confirmPasswordId}>비밀번호 확인</label>
            <input
              autoComplete="new-password"
              className="border px-2 py-1"
              id={confirmPasswordId}
              name="confirmPassword"
              type="password"
              required
            />
            {fetcher.data?.errors?.confirmPassword && (
              <p className="pl-2 text-red-600">{fetcher.data.errors.confirmPassword}</p>
            )}
          </div>
          <div className="flex justify-end">
            <button className="border px-3 py-2" type="submit">
              {isPending ? '로딩 중...' : '회원가입'}
            </button>
          </div>
        </fieldset>
      </fetcher.Form>
    </main>
  );
}
