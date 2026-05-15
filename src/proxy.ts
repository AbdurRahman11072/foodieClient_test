import { NextResponse, type NextRequest } from 'next/server';
import { userRole } from './constants';
import { userService } from './services/user.service';

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const userSession = await userService.getUserSession();
  const currentPath = request.nextUrl.pathname;
  // console.log(currentPath);

  const role = userSession?.user.role;

  const isUserAuthorized =
    role === userRole.provider || role === userRole.admin;

  // console.log(isUserAuthorized);

  if (currentPath.startsWith('/dashboard') && !isUserAuthorized) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (userSession && currentPath.startsWith('/login')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (userSession && currentPath.startsWith('/sign-up')) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  if (!userSession && currentPath.startsWith('/orders')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (!userSession && currentPath.startsWith('/checkout')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (
    currentPath.startsWith('/restaurants/create-restaurant') &&
    userSession.user.restaurantId !== null
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
}

export const config = {
  matcher: [
    '/',
    '/orders',
    '/checkout',
    '/restaurants',
    '/restaurants/:path*',
    '/login',
    '/sign-up',
    '/dashboard',
    '/dashboard/:path*',
  ],
};
