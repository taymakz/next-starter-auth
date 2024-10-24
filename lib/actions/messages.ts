"use server"


import { VerificationOTPUsageEnum } from "../types/authenticate"
import { ApiResponseType } from "../types/response"



const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_API}/messages`

export async function RequestVerificationOTP(to: string, otp_usage: VerificationOTPUsageEnum): Promise<ApiResponseType<null> | null> {

  const response = await fetch(`${BASE_URL}/verification/request/otp/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to,
      otp_usage
    })

  })
  if (!response.ok) {
    return null
  }

  return await response.json()
}
