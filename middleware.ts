import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  authSessionCookieName,
  isAuthenticateSessionAccessTokenExpired,
  parseAuthenticateSessionCookie
} from "./lib/authenticate";
import { RefreshAccessTokenSet } from "./lib/actions/authenticate";

// Main middleware function
export async function middleware(request: NextRequest) {
  // const cookieStore = await cookies();
  // const rawSession = cookieStore.get(authSessionCookieName)?.value;

  // // Check if the current request matches the routes that require login
  // if (shouldLoginMatcher(request)) {
  //   return await handleShouldLogin(request, rawSession);
  // }

  // // Check if the current request matches the routes where logged-in users shouldn't access
  // if (shouldNotLoginMatcher(request)) {
  //   return handleShouldNotLogin(request, rawSession);
  // }

  // // Proceed as usual if it's neither a protected nor a public route
  // return NextResponse.next();
}
// Middleware config to apply the middleware to certain routes
export const config = {
  matcher: [
    // should logged out
    '/auth/:path*',


    // should logged in
    '/profile/:path*',
    '/checkout/shipping',
    '/checkout/payment',
  ],
};

// Mini function to handle protected routes where user must be logged in
async function handleShouldLogin(request: NextRequest, rawSession: string | undefined) {
  if (!rawSession) {
    return redirectToSignIn(request);
  }

  const { access_exp, refresh } = parseAuthenticateSessionCookie(rawSession);
  const isExpiredAccessToken = await isAuthenticateSessionAccessTokenExpired(access_exp);

  if (!isExpiredAccessToken) {
    return NextResponse.next();
  }

  try {
    const newRawSession = await RefreshAccessTokenSet(refresh);
    const response = NextResponse.next();
    response.cookies.set(authSessionCookieName, JSON.stringify(newRawSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  } catch (e) {
    return redirectToSignIn(request);
  }
}

// Mini function to handle routes where logged-in users should not access
function handleShouldNotLogin(request: NextRequest, rawSession: string | undefined) {
  if (rawSession) {
    return redirectToHome(request);
  }

  // If no session, allow access to login/register routes
  return NextResponse.next();
}

// Matcher for routes that require login (protected routes)
function shouldLoginMatcher(request: NextRequest): boolean {
  const protectedRoutePatterns = [
    /^\/profile(\/.*)?$/,            // Matches /profile and any sub-paths like /profile/edit, /profile/settings, etc.
    /^\/checkout\/shipping$/,        // Matches /checkout/shipping exactly
    /^\/checkout\/payment$/,         // Matches /checkout/payment exactly
  ];
  return protectedRoutePatterns.some((pattern) => pattern.test(request.nextUrl.pathname));
}


// Matcher for routes where logged-in users should not access (e.g., login, register)
function shouldNotLoginMatcher(request: NextRequest): boolean {
  const authRoutePattern = /^\/auth(\/.*)?$/;  // Matches /auth and any sub-routes like /auth/login, /auth/register, etc.
  return authRoutePattern.test(request.nextUrl.pathname);
}

// Redirect to login page and clear session cookie

function redirectToSignIn(request: NextRequest) {
  // Capture the current URL path to use as a "backURL" for redirection after login
  const backURL = request.nextUrl.pathname || '';

  // Create a new URL for the redirect
  const url = new URL(request.url);
  url.pathname = '/auth/login';  // Always redirect to the login page

  // If there's a `backURL`, append it as a query parameter for future redirection
  if (backURL) {
    url.searchParams.set('backURL', backURL);
  }

  // Create the redirect response
  const response = NextResponse.redirect(url.toString());

  // Clear the session cookie
  response.cookies.delete(authSessionCookieName);

  return response;
}
// Redirect logged-in users to dashboard
function redirectToHome(request: NextRequest) {
  const url = new URL(request.url);
  url.pathname = '/';
  return NextResponse.redirect(url.toString());
}


