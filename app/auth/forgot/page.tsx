"use client"

import { ForgotPasswordSectionEnum } from "@/lib/types/authenticate"
import { useState } from "react"
import { ForgotCheckSection } from "./check"
import { ForgotOneTimePasswordSection } from "./one-time-password"
import { ForgotResetSection } from "./reset"

export default function AuthForgot() {
  const [username, setUsername] = useState<string>('')
  const [section, setSection] = useState<ForgotPasswordSectionEnum>(ForgotPasswordSectionEnum.RESET)

  return (
    <div>

      {section === ForgotPasswordSectionEnum.CHECK && <ForgotCheckSection username={username} setUsername={setUsername} setSection={setSection} />}

      {section === ForgotPasswordSectionEnum.OTP && <ForgotOneTimePasswordSection username={username} setSection={setSection} />}

      {section === ForgotPasswordSectionEnum.RESET && <ForgotResetSection username={username} setSection={setSection} />}

    </div>
  )
}
