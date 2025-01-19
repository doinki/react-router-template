import { redirect } from 'react-router';

import { prisma } from '~/prisma.server';
import { getAuthSession } from '~/utils/auth.server';

import { type Route } from './+types/signout';

export async function loader() {
  return redirect('/');
}

export async function action({ request }: Route.ActionArgs) {
  const { destroySession, sessionId } = await getAuthSession(request);
  if (sessionId) {
    prisma.session.delete({ where: { id: sessionId } }).catch(() => {});
  }

  return redirect('/', {
    headers: {
      'Set-Cookie': await destroySession(),
    },
  });
}
