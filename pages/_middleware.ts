import { NextRequest, NextFetchEvent, NextResponse } from 'next/server';

export const middleware = async (req: NextRequest, ev: NextFetchEvent) => {
  // TODO : Authentication

  // TODO : Bot protection
  if (req.ua?.isBot) {
    return new Response("Plz don't be a bot.", { status: 403 });
  }

  // TODO : Redirects and rewrites
  if (req.page.name === '/' && !req.cookies.helloToken) {
    return NextResponse.redirect('http://localhost:3000/blocked');
  }

  // TODO : Handling unsupported browsers

  // TODO : Feature flags and A/B tests

  // TODO : Advanced i18n routing requirements
};
