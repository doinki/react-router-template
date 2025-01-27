import './tailwind.css';

import {
  Form,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';

import { type Route } from './+types/root';
import { Mado } from './components/Mado';
import { Progress } from './components/Progress';
import { getUserId } from './utils/auth.server';

export async function loader({ context, request }: Route.LoaderArgs) {
  context.timing.startTime(context.c, 'userId');
  const userId = await getUserId(request);
  context.timing.endTime(context.c, 'userId');

  return { userId };
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <header className="sticky top-0 flex justify-center border-b">
        <div className="flex max-w-screen-xl flex-1 items-center px-10 py-2">
          <Link title="홈으로 이동하기" to="/">
            <Mado height={48} width={48} />
          </Link>
          <div className="ml-auto flex gap-4">
            {loaderData.userId ? (
              <Form action="/signout" method="post">
                <button type="submit">로그아웃</button>
              </Form>
            ) : (
              <>
                <Link to="/signin">로그인</Link>
                <Link to="/signup">회원가입</Link>
              </>
            )}
          </div>
        </div>
      </header>
      <Outlet />
      <Progress />
    </>
  );
}
