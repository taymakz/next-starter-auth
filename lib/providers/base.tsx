"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import ReactQueryProvider from "./ReactQuery";
import { useAuthenticateStore } from "../stores/authenticate";
import { useEffect } from "react";

export function BaseProvider({ children }: { children: React.ReactNode }) {
  const GetUserDetail = useAuthenticateStore((state) => state.GetUserDetail)

  useEffect(() => {
    GetUserDetail()
  }, [])



  return (
    <ReactQueryProvider>

      <NextThemesProvider
        attribute="class"
        defaultTheme="dark"
        disableTransitionOnChange
      >
        {children}
      </NextThemesProvider>

    </ReactQueryProvider>
  );
}
