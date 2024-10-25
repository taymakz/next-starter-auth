"use server";
import memoize from "memoize";
import {
  getAuthenticateSession,
  parseAuthenticateSessionCookie,
  removeAuthenticateSession,
  saveAuthenticateSession,
} from "../authenticate";
import {
  AuthenticateCheckResultType,
  AuthenticateTokensType,
  ForgotPasswordResetResultType,
  ForgotPasswordTokenType,
  UserDetailType,
} from "../types/authenticate";
import { ApiResponseType } from "../types/response";
import { baseFetch, clientFetch } from "../request";

const BASE_URL = "user";

export async function AuthenticationCheck(
  username: string,
): Promise<ApiResponseType<AuthenticateCheckResultType>> {
  return await baseFetch(`${BASE_URL}/authenticate/check/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
    }),
  });
}

export async function AuthenticationPassword(
  username: string,
  password: string,
): Promise<ApiResponseType<AuthenticateTokensType>> {
  const result = await baseFetch<AuthenticateTokensType>(
    `${BASE_URL}/authenticate/password/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    },
  );
  if (!result.success) return result;
  saveAuthenticateSession(result.data);
  return result;
}

export async function AuthenticationOneTimePassword(
  username: string,
  otp: string,
): Promise<ApiResponseType<AuthenticateTokensType>> {
  const result = await baseFetch<AuthenticateTokensType>(
    `${BASE_URL}/authenticate/otp/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        otp,
      }),
    },
  );

  if (!result.success) return result;
  saveAuthenticateSession(result.data);
  return result;
}

export async function RefreshAccessTokenSet(
  refresh: string,
): Promise<AuthenticateTokensType> {
  const result = await baseFetch<AuthenticateTokensType>(
    `${BASE_URL}/token/refresh/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh,
      }),
    },
  );

  if (!result.success) {
    throw new Error("Failed to refresh token");
  }
  const newTokens = {
    access: result.data.access,
    refresh: refresh,
    access_exp: result.data.access_exp,
  } as AuthenticateTokensType;

  return newTokens;
}

const refreshAccessTokenSetMemoized = memoize(RefreshAccessTokenSet, {
  maxAge: 3_000,
  cacheKey: (args: [string]) => JSON.stringify(args[0]),
});

// need to be in Try Cache
export async function RefreshAccessToken(): Promise<AuthenticateTokensType> {
  const rawSession = await getAuthenticateSession();
  if (!rawSession) {
    throw new Error("Session Cookie not Found");
  }
  const { refresh } = parseAuthenticateSessionCookie(rawSession);
  const newSession = await refreshAccessTokenSetMemoized(refresh);
  saveAuthenticateSession(newSession);
  return newSession;
}

export async function GetCurrentUserDetail(): Promise<
  ApiResponseType<UserDetailType | null>
> {
  const tokens = await getAuthenticateSession();
  if (!tokens)
    return {
      success: false,
      status: 0,
      message: "",
      data: null,
    } as ApiResponseType<null>;
  return await clientFetch(`${BASE_URL}/request/current/`);
}

export async function LogoutUser(): Promise<ApiResponseType<null>> {
  try {
    const session = await getAuthenticateSession();
    if (!session) throw new Error("Session Cookie not Found");

    const { refresh } = parseAuthenticateSessionCookie(session);
    const result = await clientFetch<null>(`${BASE_URL}/logout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh }),
    });

    return result;
  } finally {
    await removeAuthenticateSession();
  }
}

// Forgot Password
export async function ForgotPasswordCheck(
  username: string,
): Promise<ApiResponseType<null>> {
  return await baseFetch(`${BASE_URL}/forgot/password/check/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
    }),
  });
}

export async function ForgotPasswordOneTimePassword(
  username: string,
  otp: string,
): Promise<ApiResponseType<ForgotPasswordTokenType>> {
  return await baseFetch(`${BASE_URL}/forgot/password/otp/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      otp,
    }),
  });
}

export async function ForgotPasswordReset(
  username: string,
  token: string,
  password: string,
  confirm_password: string,
): Promise<ApiResponseType<ForgotPasswordResetResultType>> {
  const result = await baseFetch<ForgotPasswordResetResultType>(
    `${BASE_URL}/forgot/password/reset/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        token,
        password,
        confirm_password,
      }),
    },
  );
  if (!result.success) return result;
  const tokens = {
    refresh: result.data.refresh,
    access: result.data.access,
    access_exp: result.data.access_exp,
  } as AuthenticateTokensType;
  saveAuthenticateSession(tokens);
  return result;
}
