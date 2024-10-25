"use client";

import { AuthenticateSectionEnum } from "@/lib/types/authenticate";
import { useState } from "react";
import { CheckSection } from "./check";
import { PasswordSection } from "./password";
import { OneTimePasswordSection } from "./one-time-password";

export default function AuthLogin() {
  const [username, setUsername] = useState<string>("");
  const [canLoginWithPassword, setCanLoginWithPassword] =
    useState<boolean>(false);
  const [section, setSection] = useState<AuthenticateSectionEnum>(
    AuthenticateSectionEnum.CHECK,
  );

  return (
    <div>
      {section === AuthenticateSectionEnum.CHECK && (
        <CheckSection
          username={username}
          setUsername={setUsername}
          setSection={setSection}
        />
      )}
      {section === AuthenticateSectionEnum.PASSWORD && (
        <PasswordSection
          username={username}
          setSection={setSection}
          setCanLoginWithPassword={setCanLoginWithPassword}
        />
      )}
      {section === AuthenticateSectionEnum.OTP && (
        <OneTimePasswordSection
          username={username}
          setSection={setSection}
          canLoginWithPassword={canLoginWithPassword}
        />
      )}
    </div>
  );
}
