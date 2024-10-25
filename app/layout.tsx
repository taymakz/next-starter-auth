import type { Metadata } from "next";
import "@/app/assets/styles/app.css";

import { BaseProvider } from "@/lib/providers/base";
import { appDescription, appTitle } from "@/lib/constants";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    template: `${appTitle} | $s`,
    default: appTitle,
  },
  description: appDescription,
  icons: {
    icon: "/images/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa-IR" dir="rtl" suppressHydrationWarning>
      <body>
        <BaseProvider>
          {children}
          <Toaster />
        </BaseProvider>
      </body>
    </html>
  );
}
