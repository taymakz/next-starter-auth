"use client"

import { ThemeToggle } from "@/components/common/theme-toggle";
import { Button } from "@/components/ui/button";
import { useAuthenticateStore } from "@/lib/stores/authenticate";
import { useCounterStore } from "@/lib/stores/counter";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function Index() {
  const { count, decrement, increment } = useCounterStore((state) => state)
  const { isLogin,  Logout } = useAuthenticateStore()
  const router = useRouter()
  const pathname = usePathname()
  async function logout() {
    await Logout()
    router.push(`/auth/login?backURL=${pathname}`)
  }
  return (
    <>
      <div className="relative flex min-h-screen w-full items-center justify-center bg-background bg-dot-black/[0.2] dark:bg-dot-white/[0.2]">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div className="space-y-10">
          <p className="relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-8  font-bold text-transparent text-clamp-lg ">
            Nextjs 15, Shadcn, Zustand, React Query, Framer Motion Starter
          </p>
          <div className="flex gap-4 justify-center">

            <Button variant={'outline'} asChild>
              <Link href={'/components'}>
                Components Page
              </Link>
            </Button>

            {isLogin() ? (
              <Button variant={'destructive'} onClick={() => logout()} >
                Logout
              </Button>
            ) : (
              <Button variant={'outline'} asChild >
                <Link href={'/auth/login'}>
                  Login
                </Link>
              </Button>
            )}
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col items-start justify-center gap-2">
              <div className="bg-muted py-2 px-4 rounded-lg text-primary mx-auto">
                {count}
              </div>
              <div className="flex gap-2">

                <button className="bg-muted text-muted-foreground py-2 px-4 rounded-lg" onClick={() => increment(1)}>
                  افزایش
                </button>
                <button className="bg-muted text-muted-foreground py-2 px-4 rounded-lg" onClick={() => decrement(1)}>
                  کاهش
                </button>
              </div>
            </div>
            <div className="flex justify-center">


              <button className="bg-muted text-muted-foreground py-2 px-4 rounded-lg" onClick={() => toast('متن تستی')}>
                Toaster
              </button>

            </div>
          </div>
        </div>
      </div>
      <div className="absolute left-2 top-2">
        <ThemeToggle />
      </div>
    </>
  );
}
