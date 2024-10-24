import { redirect, RedirectType } from "next/navigation"
import { LogoutUser, RefreshAccessToken } from "./actions/authenticate"
import { getAuthenticateSession, isAuthenticateSessionAccessTokenExpired, parseAuthenticateSessionCookie, removeAuthenticateSession } from "./authenticate"
import { ApiResponseType } from "./types/response"



const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_API}/`

// Base fetch function to handle API calls and common status codes
export async function baseFetch<T>(input: RequestInfo | URL, init?: RequestInit): Promise<ApiResponseType<T>> {

  init = {
    method: 'GET',
    ...init,
  }
  const result = await fetch(`${BASE_URL}${input}`, init);


  // Check for common status codes and return corresponding messages
  if (!result.ok) {

    switch (result.status) {
      case 429:
        return { success: false, status: 429, message: 'لطفا لحظاتی بعد تلاش کنید', data: null } as ApiResponseType<T>
      case 500:
        return { success: false, status: 500, message: 'مشکلی در سرور رخ داده است', data: null } as ApiResponseType<T>
      case 503:
        return { success: false, status: 503, message: 'درحال حاضر سرور در دسترس نمیباشد', data: null } as ApiResponseType<T>
      default:
        return { success: false, status: result.status, message: 'مشکلی در عملیات رخ داده', data: null } as ApiResponseType<T>
    }
  }
  // Handle successful response
  return await result.json();
}
export async function clientFetch<T>(input: RequestInfo | URL, init?: RequestInit): Promise<ApiResponseType<T>> {
 
  init = {
    method: 'GET',
    ...init,
  }
  // const currentPath = window.location.pathname;  // Get current path
  const currentPath = '/'
  // redirect(`/components=${currentPath}`);

  const rawSession = await getAuthenticateSession()
  if (!rawSession) {
    // toast('لطفا مجددا وارد حساب خود شوید')
    redirect(`/auth/login?backURL=${currentPath}`, RedirectType.push);
  }
  const { access_exp, access } = parseAuthenticateSessionCookie(rawSession)
  const isExpiredAccessToken = await isAuthenticateSessionAccessTokenExpired(access_exp)
  let access_token = access
  if (isExpiredAccessToken) {
    try {
      const newSession = await RefreshAccessToken()
      access_token = newSession.access
    } catch (error) {
      if (error instanceof Error && error.message === "Session Cookie not Found") {
        // Session cookie missing, prompt user to login again
        // toast('لطفا مجددا وارد حساب خود شوید')
        redirect(`/auth/login?backURL=${currentPath}`, RedirectType.push);

      }
      // If token refresh fails, log out user
      if (error instanceof Error && (
        error.message === "Failed to parse Session Cookie" ||
        error.message === "Failed to refresh token"
      )) {
        // Refresh token is not valid, log out the user
        await LogoutUser()
        // toast('لطفا مجددا وارد حساب خود شوید')
        redirect(`/auth/login?backURL=${currentPath}`, RedirectType.push);
      }
    }
  }
  // token set token in headers
  init = {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${access_token}`,
    }
  }
  // Proceed with the API call after ensuring the token is valid
  try {
    const response = await fetch(`${BASE_URL}${input}`, init)

    if (!response.ok) {
      // Handle non-OK responses like 401 or 429
      if (response.status === 401) {
        removeAuthenticateSession()
        // Token might still be invalid, suggest logging in
        // toast('لطفا مجددا وارد حساب خود شوید')
        redirect(`/auth/login?backURL=${currentPath}`, RedirectType.push);

      }
      if (response.status === 429) {
        // Too many requests, rate limit exceeded
        // toast('لطفا لحظاتی بعد تلاش کنید')
        return {
          success: false,
          status: 429,
          message: 'لطفا لحظاتی بعد تلاش کنید',
          data: null,
        } as ApiResponseType<T>
      }
    }
    // Handle successful response
    const result: ApiResponseType<T> = await response.json()
    return result

  } catch (error: any) {
    // Network-related errors or failed fetch requests
    if (error.message?.includes('Failed to fetch')) {
      return {
        success: false,
        status: 503,
        message: 'درحال حاضر سرور در دسترس نمیباشد',
        data: null,
      } as ApiResponseType<T>
    }
    // Generic error handling
    return {
      success: false,
      status: error.response?.status || 500,
      message: 'مشکلی در عملیات رخ داده',
      data: null,
    } as ApiResponseType<T>
  }
}
