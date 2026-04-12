import { NextResponse, type NextRequest } from 'next/server';
import { userRole } from './constants';
import { userSerivce } from './services/user.service';

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const userSession = await userSerivce.getUserSession();
  const currentPath = request.nextUrl.pathname;
  console.log(currentPath);

  const role = userSession?.user.role;
  console.log(role);

  const isUserAuthorized =
    role === userRole.provider || role === userRole.admin;

  console.log(isUserAuthorized);

  if (currentPath.startsWith('/dashboard') && !isUserAuthorized) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (userSession && currentPath.startsWith('/login')) {
    console.log('login');

    return NextResponse.redirect(new URL('/', request.url));
  }

  if (userSession && currentPath.startsWith('/sign-up')) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: ['/login', '/sign-up', '/dashboard', '/dashboard/:path*'],
};
