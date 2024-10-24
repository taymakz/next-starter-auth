import { cookies } from 'next/headers';

import { AuthenticateTokensType } from "./types/authenticate";
import * as z from 'zod'
import { NextRequest, NextResponse } from 'next/server';
export const authSessionCookieName = "AUTH_TOKENS_SESSION"
export async function saveAuthenticateSession(tokens: AuthenticateTokensType): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(authSessionCookieName, JSON.stringify(tokens), {
    httpOnly: true,
    secure: process
      .env.NODE_ENV === "production"
  })


}
export async function removeAuthenticateSession(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(authSessionCookieName)
}
export async function getAuthenticateSession(): Promise<string | undefined> {
  const cookieStore = await cookies();

  return cookieStore.get(authSessionCookieName)?.value
}

const sessionCookieSchema = z.object({
  refresh: z.string(),
  access: z.string(),
  access_exp: z.number(),
})
export function parseAuthenticateSessionCookie(cookie: string): { refresh: string, access: string, access_exp: number } {
  try {

    const session = sessionCookieSchema.parse(JSON.parse(cookie))
    return session
  } catch {
    throw new Error("Failed to parse Session Cookie")
  }
}

export async function isAuthenticateSessionAccessTokenExpired(exp?: number): Promise<boolean> {
  if (!exp) {
    const session = await getAuthenticateSession()
    if (!session) {
      return true
    }
    const { access_exp } = parseAuthenticateSessionCookie(session)
    exp = access_exp
  }
  if (Math.floor(Date.now() / 1000) > exp) {
    return true
  }
  return false

}

