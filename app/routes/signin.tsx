import * as bcrypt from 'bcrypt';
import { useId } from 'react';
import { data, redirect, useFetcher } from 'react-router';

import { prisma } from '~/prisma.server';
import {
  getAuthSession,
  getSessionExpiredAt,
  requireAnonymous,
  signinFormSchema,
} from '~/utils/auth.server';

import { type Route } from './+types/signin';

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
  } = signinFormSchema.safeParse(Object.fromEntries(await request.formData()));
  if (!success) {
    return data({
      errors: error.flatten().fieldErrors,
    });
  }

  const user = await prisma.user.findUnique({
    select: {
      id: true,
      password: {
        select: {
          hash: true,
        },
      },
    },
    where: { email: fieldValues.email },
  });
  if (!user) {
    return data({ errors: { email: 'Email not found' } }, { status: 400 });
  }
  if (!user.password) {
    return data(
      { errors: { password: 'Password not found' } },
      { status: 400 },
    );
  }
  if (!bcrypt.compareSync(fieldValues.password, user.password.hash)) {
    return data(
      { errors: { password: 'Password incorrect' } },
      { status: 400 },
    );
  }

  const session = await prisma.session.create({
    data: {
      expiredAt: getSessionExpiredAt(),
      userId: user.id,
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

export default function Signin() {
  const fetcher = useFetcher();
  const isPending = fetcher.state !== 'idle';

  const emailId = useId();
  const passwordId = useId();

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
              autoComplete="current-password"
              className="border px-2 py-1"
              id={passwordId}
              name="password"
              type="password"
              required
            />
            {fetcher.data?.errors?.password && (
              <p className="pl-2 text-red-600">
                {fetcher.data.errors.password}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <button className="border px-3 py-2" type="submit">
              {isPending ? '로딩 중...' : '로그인'}
            </button>
          </div>
        </fieldset>
      </fetcher.Form>
    </main>
  );
}
