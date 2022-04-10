import { NextRequest, NextFetchEvent, NextResponse } from 'next/server';

export const middleware = async (req: NextRequest, ev: NextFetchEvent) => {
  // TODO : Authentication

  // TODO : Bot protection
  if (req.ua?.isBot) {
    return new Response("Plz don't be a bot.", { status: 403 });
  }

  // TODO : Redirects and rewrites
  if (
    req.nextUrl.pathname !== '/blocked' &&
    !req.cookies[process.env.NEXT_PUBLIC_COOKIE_NAME!]
  ) {
    return NextResponse.rewrite('http://localhost:3000/blocked');
  }
  // Tryng to access the /blocked page manually is disallowed
  if (req.nextUrl.pathname === '/blocked') {
    return new Response(null, { status: 404 });
  }

  // TODO : Handling unsupported browsers

  // TODO : Feature flags and A/B tests

  // TODO : Advanced i18n routing requirements
};
